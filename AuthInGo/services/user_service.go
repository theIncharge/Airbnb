package services

import (
	env "AuthInGo/config/env"
	db "AuthInGo/db/repositories"
	"AuthInGo/dto"
	"AuthInGo/models"
	"AuthInGo/utils"
	"fmt"

	"github.com/golang-jwt/jwt"
)

type UserService interface {
	LoginUser(payload *dto.LoginUserRequestDto) (string, error)
	GetUserById(id string) (*models.User, error)
	CreateUser(payload *dto.CreateUserRequestDto) (*models.User, error)
}
type UserServiceImpl struct {
	UserRepoistory db.UserRepository
}

func NewUserService(_userRepository db.UserRepository) UserService {
	return &UserServiceImpl{
		UserRepoistory: _userRepository,
	}
}

func (u *UserServiceImpl) CreateUser(payload *dto.CreateUserRequestDto) (*models.User, error) {

	fmt.Println("Creating user in user service")
	password := payload.Password
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		fmt.Println(`Error hashing password`)
		return nil, err
	}
	user, err := u.UserRepoistory.Create(
		payload.Username,
		payload.Email,
		hashedPassword,
	)
	if err != nil {
		fmt.Println("Error creating the password: ", err)
		return nil, err
	}
	return user, nil

}

func (u *UserServiceImpl) LoginUser(payload *dto.LoginUserRequestDto) (string, error) {

	email := payload.Email
	password := payload.Password

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

	jwtPayload := jwt.MapClaims{
		"email": user.Email,
		"id":    user.Id,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwtPayload)

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

func (u *UserServiceImpl) GetUserById(id string) (*models.User, error) {
	user, err := u.UserRepoistory.GetById(id)
	if err != nil {
		fmt.Println("Error fetching user: ", err)
		return nil, err
	}
	return user, nil
}
