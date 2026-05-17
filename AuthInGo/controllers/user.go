package controllers

import (
	"AuthInGo/dto"
	"AuthInGo/services"
	"AuthInGo/utils"
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
	fmt.Println("Fetching user by ID in UserController")
	// extract userid from url parameters
	userId := r.URL.Query().Get("id")
	if userId == "" {
		userId = r.Context().Value("userID").(string) // Fallback to context if not in URL
	}

	fmt.Println("User ID from context or query:", userId)

	if userId == "" {
		utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "User ID is required", fmt.Errorf("missing user ID"))
		return
	}
	user, err := uc.UserService.GetUserById(userId)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch user", err)
		return
	}
	if user == nil {
		utils.WriteJsonErrorResponse(w, http.StatusNotFound, "User not found", fmt.Errorf("user with ID %d not found", userId))
		return
	}
	utils.WriteJsonSuccessResponse(w, http.StatusOK, "User fetched successfully", user)
	fmt.Println("User fetched successfully:", user)
}

func (uc *UserController) CreateUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("CreateUser called in user controller")

	payload := r.Context().Value("payload").(dto.CreateUserRequestDto)

	user, err := uc.UserService.CreateUser(&payload)

	if err != nil {
		fmt.Println("Error creating the user: ", err)
		return
	}
	utils.WriteJsonSuccessResponse(w, http.StatusOK, "User created successfully", user)
	fmt.Println("Successfully created the user")
}

func (uc *UserController) LoginUser(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Login called in user controller")

	payload := r.Context().Value("payload").(dto.LoginUserRequestDto)

	if validationError := utils.Validator.Struct(payload); validationError != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Invalid input data", validationError)
		return
	}

	jwtToken, err := uc.UserService.LoginUser(&payload)
	if err != nil {
		utils.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to login user", err)
		return
	}

	utils.WriteJsonSuccessResponse(w, http.StatusOK, "User Logged in succesfully", jwtToken)
	// w.Write([]byte("User fetching Endpoint"))
}
