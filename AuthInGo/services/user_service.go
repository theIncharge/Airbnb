package services

import (
	db "AuthInGo/db/repositories"
	"AuthInGo/utils"
	"fmt"
)

type UserService interface {
	GetUserById() error
	CreateUser() error
	LoginUser() error
}
type UserServiceImpl struct {
	UserRepoistory db.UserRepository
}

func (u *UserServiceImpl) GetUserById() error {
	fmt.Println("Creating user in user service")
	return nil
}

func NewUserService(_userRepository db.UserRepository) UserService {
	return &UserServiceImpl{
		UserRepoistory: _userRepository,
	}
}

func (u *UserServiceImpl) CreateUser() error {

	fmt.Println("Creating user in user service")
	password := "example_password"
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		fmt.Println(`Error hashing password`)
		return err
	}
	u.UserRepoistory.Create(
		"username_example",
		"user@example.com",
		hashedPassword,
	)
	return nil

}

func (u *UserServiceImpl) LoginUser() error {

	response := utils.CheckPassword("example_password", "")
	fmt.Println("Login Response: ", response)
	return nil

}
