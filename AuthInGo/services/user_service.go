package services

import (
	db "AuthInGo/db/repositories"
	"fmt"
)

type UserService interface {
	Create() error
}
type UserServiceImpl struct {
	UserRepoistory db.UserRepository
}

func (u *UserServiceImpl) Create() error {
	fmt.Println("Creating user in user service")
	u.UserRepoistory.Create()
	return nil
}

func NewUserService(_userRepository db.UserRepository) *UserServiceImpl {
	return &UserServiceImpl{
		UserRepoistory: _userRepository,
	}
}
