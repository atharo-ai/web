package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(versionCmd)
}

var versionCmd = &cobra.Command{
	Use:   "try [command name in atharo.yaml]",
	Short: "Demo your Atharo function",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("TODO Implement try")
	},
}
