package router

import (
	"AuthInGo/controllers"
	"AuthInGo/middlewares"
	"fmt"

	"github.com/go-chi/chi"
)

type UserRouter struct {
	UserController *controllers.UserController
}

func NewUserRouter(_userController *controllers.UserController) *UserRouter {
	return &UserRouter{
		UserController: _userController,
	}
}
func (ur *UserRouter) Register(r chi.Router) {
	fmt.Println("Setting up use router")

	r.With(middlewares.JWTAuthMiddleware).Get("/profile", ur.UserController.GetUserById)
	r.With(middlewares.UserCreateRequestValidator).Post("/signup", ur.UserController.CreateUser)
	r.With(middlewares.UserLoginRequestValidator).Post("/login", ur.UserController.LoginUser)
}
