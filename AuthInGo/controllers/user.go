package controllers

import (
	"AuthInGo/services"
	"fmt"
	"net/http"
)

type UserController struct {
	UserService services.UserService
}

func NewUserController(_userService services.UserService) *UserController {
	return &UserController{
		UserService: _userService,
	}

}

func (uc *UserController) GetUserById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("User controller here")
	uc.UserService.GetUserById()
	w.Write([]byte("User fetching Endpoint"))
}
func (uc *UserController) CreateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("CreateUser called in user controller")
	uc.UserService.CreateUser()
	w.Write([]byte("User fetching Endpoint"))
}

func (uc *UserController) LoginUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Login called in user controller")
	uc.UserService.LoginUser()
	w.Write([]byte("User fetching Endpoint"))
}
