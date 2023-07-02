package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(deploy)
}

var deploy = &cobra.Command{
	Use:   "deploy",
	Short: "Deploy your Atharo plugin for live use",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("TODO Implement deploy")
	},
}
