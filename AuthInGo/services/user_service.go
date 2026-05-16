package services

import (
	env "AuthInGo/config/env"
	db "AuthInGo/db/repositories"
	"AuthInGo/utils"
	"fmt"

	"github.com/golang-jwt/jwt"
)

type UserService interface {
	GetUserById() error
	CreateUser() error
	LoginUser() (string, error)
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
		"username1_example",
		"user1@example.com",
		hashedPassword,
	)
	return nil

}

func (u *UserServiceImpl) LoginUser() (string, error) {

	email := "user1@example.com"
	password := "example_password"

	user, err := u.UserRepoistory.GetByEmail(email)
	if err != nil {
		fmt.Println("Error finding user by email: ", err)
		return "", err
	}

	if user == nil {
		fmt.Println("No User Found")
		return "", fmt.Errorf("No user found with email: %s", email)
	}
	fmt.Println(user.Password)
	isPasswordValid := utils.CheckPassword(password, user.Password)
	if !isPasswordValid {
		fmt.Println("Login Response: ", isPasswordValid)
		return "", fmt.Errorf("Invalid Password or User")
	}

	fmt.Println("User Logged in successfully. JWT token will be printed here")

	payload := jwt.MapClaims{
		"email": user.Email,
		"id":    user.Id,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)

	fmt.Println("Token before signing : ", token)
	key := env.GetString("JWT_SECRET", "root")
	fmt.Println("Key: ", key)
	tokenString, err := token.SignedString([]byte(key))

	if err != nil {
		fmt.Println("Error signing token: ", err)
		return "", err
	}
	fmt.Println("JWT Token: ", tokenString)
	return tokenString, nil

}
