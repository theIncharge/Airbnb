package router

import (
	"AuthInGo/controllers"
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
	r.Get("/profile", ur.UserController.GetUserById)
	r.Post("/signup", ur.UserController.CreateUser)
	r.Post("/login", ur.UserController.LoginUser)
}
