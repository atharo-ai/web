package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(logout)
}

var logout = &cobra.Command{
	Use:   "logout",
	Short: "Clear your Atharo credentials",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("TODO Implement logout")
	},
}
