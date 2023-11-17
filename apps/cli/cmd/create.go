/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	v1 "azubi-toolbox/packages/azubi-toolbox-go/gen/azubi_toolbox/user/v1"
	"azubi-toolbox/packages/azubi-toolbox-go/gen/azubi_toolbox/user/v1/v1connect"
	"context"
	"fmt"
	"net/http"

	"connectrpc.com/connect"
	"github.com/spf13/cobra"
)

// createCmd represents the create command
var createCmd = &cobra.Command{
	Use:   "create",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: run,
}

func init() {
	rootCmd.AddCommand(createCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// createCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// createCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}

func run(cmd *cobra.Command, args []string) {
	client := v1connect.NewUserServiceClient(http.DefaultClient, "http://localhost:8081/")
	req := connect.NewRequest(&v1.CreateUserRequest{
		AuthId: "test",
	})

	res, err := client.CreateUser(context.Background(), req)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("ID: ", res.Msg.Id)

}
