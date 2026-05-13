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
	r.Post("/signup", ur.UserController.RegisterUser)
}
