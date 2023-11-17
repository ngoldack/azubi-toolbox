package main

import (
	"context"
	"log"
	"net/http"

	userv1 "azubi-toolbox/packages/azubi-toolbox-go/gen/azubi_toolbox/user/v1"
	"azubi-toolbox/packages/azubi-toolbox-go/gen/azubi_toolbox/user/v1/v1connect"

	"connectrpc.com/connect"
	"connectrpc.com/grpcreflect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

type UserServer struct {
}

func (us *UserServer) CreateUser(ctx context.Context, req *connect.Request[userv1.CreateUserRequest]) (*connect.Response[userv1.CreateUserResponse], error) {
	log.Println("CreateUser called")
	log.Println("AuthId: ", req.Msg.AuthId)
	return &connect.Response[userv1.CreateUserResponse]{
		Msg: &userv1.CreateUserResponse{
			Id: req.Msg.AuthId,
		},
	}, nil
}

func main() {
	mux := http.NewServeMux()

	reflector := grpcreflect.NewStaticReflector(
		v1connect.UserServiceName,
	)

	mux.Handle(v1connect.NewUserServiceHandler(&UserServer{}))
	mux.Handle(grpcreflect.NewHandlerV1(reflector))
	mux.Handle(grpcreflect.NewHandlerV1Alpha(reflector))

	log.Println("listening on :8081")
	err := http.ListenAndServe(":8081", h2c.NewHandler(mux, &http2.Server{}))
	log.Fatalf("listen failed: %v", err)
}
