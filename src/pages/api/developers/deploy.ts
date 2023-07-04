// Backend
import formidable from "formidable";
import { type NextApiRequest, type NextApiResponse } from "next";
import { createId } from "@paralleldrive/cuid2";
import fs from "fs";
import yaml from "js-yaml";
import { spawn } from "child_process";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import denoTemplate from "./denoTemplate.txt";
import { prisma } from "~/server/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

type PluginDefinition = {
  version: number;
  id: string;
  name: string;
  description: string;
  features: {
    [key: string]: {
      description: string;
      example: string;
      entry: string;
      parameters: {
        [key: string]: {
          description: string;
          type: string;
          required: boolean;
          options?: string[];
        };
      }[];
    };
  };
};

const deploy = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({});
  let pluginId = createId();
  const folderName = pluginId;
  try {
    if (!prisma) {
      throw new Error("Prisma not initialized");
    }

    const [_, files] = await form.parse(req);
    // Create folder with createid for unique ID
    fs.mkdirSync(`./uploads/${folderName}`, { recursive: true });
    Object.values(files).forEach((file) => {
      if (Array.isArray(file)) {
        file.forEach((f) => {
          if (!f.originalFilename) {
            throw new Error("Original filename missing");
          }
          fs.renameSync(
            f.filepath,
            `./uploads/${folderName}/${f.originalFilename}`
          );
        });
      }
    });

    if (!fs.existsSync(`uploads/${folderName}/atharo.yaml`)) {
      throw new Error("atharo.yaml missing");
    }

    const pluginYaml = fs.readFileSync(
      `uploads/${folderName}/atharo.yaml`,
      "utf8"
    );
    const pluginDefinition = yaml.load(pluginYaml) as PluginDefinition;

    const commandMap = [];
    for (const [name, command] of Object.entries(pluginDefinition.features)) {
      if (!fs.existsSync(`uploads/${folderName}/${command.entry}`)) {
        throw new Error("Command entrypoint missing");
      }
      commandMap.push({
        id: createId(),
        name,
      });
    }

    const newServerTemplate = (denoTemplate as string)
      .replace(
        "{{ imports }}",
        commandMap
          .map((v) => `import ${v.id} from "./${v.name}.ts";`)
          .join("\n")
      )
      .replace(
        "{{ routes }}",
        commandMap
          .map(
            (v) => `
        router.post("/${v.name}", async (ctx) => {
          const body = ctx.request.body({ type: 'json' });
          ctx.response.body = ${v.id}(body);
        });
      `
          )
          .join("\n")
      );

    fs.writeFileSync(`./uploads/${folderName}/main.ts`, newServerTemplate);

    const safePluginName = pluginDefinition.name
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

    // Check if plugin already exists
    const existingPlugin = await prisma.plugin.findUnique({
      where: {
        safeName: safePluginName,
      },
    });

    if (!existingPlugin) {
      await prisma.plugin.create({
        data: {
          id: pluginId,
          title: pluginDefinition.name,
          safeName: safePluginName,
          description: pluginDefinition.description,
          yaml: pluginYaml,
        },
      });

      await fetch("https://dash.deno.com/_api/projects", {
        method: "POST",
        body: JSON.stringify({
          name: pluginId,
          organizationId: process.env.DENO_ORGANIZATION_ID,
        }),
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${process.env.DENO_DEPLOY_TOKEN || ""}`,
        },
      });
    } else {
      pluginId = existingPlugin.id;
    }

    console.log(pluginId);

    const prc = spawn(
      "deployctl",
      ["deploy", `--project=${pluginId}`, "--prod", `./main.ts`],
      {
        cwd: `./uploads/${folderName}`,
        env: {
          ...process.env,
          DENO_DEPLOY_TOKEN: process.env.DENO_DEPLOY_TOKEN || "",
        },
      }
    );

    //noinspection JSUnresolvedFunction
    prc.stdout.setEncoding("utf8");
    prc.stdout.on("data", function (data) {
      const str = data.toString();
      const lines = str.split(/(\r?\n)/g);
      console.log(lines.join(""));
    });

    prc.on("close", function (code) {
      fs.rmdirSync(`./uploads/${folderName}`, { recursive: true });

      if (code != 0) {
        res.status(500).end({ error: "Problem deploying files" });
        return;
      }

      res.status(200).end();
    });

    prc.on("error", function (err) {
      throw err;
    });
  } catch (err: any) {
    console.error(err);
    fs.rmdirSync(`./uploads/${folderName}`, { recursive: true });
    return res
      .status(err?.httpCode || 400)
      .json({ error: "Problem uploading files..." });
  }
};

export default deploy;
