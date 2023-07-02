package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(loginCmd)
}

var loginCmd = &cobra.Command{
	Use:   "login",
	Short: "Log in to your Atharo account",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("TODO Implement login")
	},
}
