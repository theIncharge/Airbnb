package middlewares

import (
	"AuthInGo/dto"
	"AuthInGo/utils"
	"context"
	"fmt"
	"net/http"
)

func UserLoginRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload dto.LoginUserRequestDto

		err := utils.ReadJsonRequest(r, &payload)

		if err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
			return
		}

		if err := utils.Validator.Struct(payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid payload", err)
			return
		}
		fmt.Println("Payload recieved for Login request: ", payload)

		reqContext := r.Context()

		ctx := context.WithValue(reqContext, "payload", payload)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func UserCreateRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload dto.CreateUserRequestDto

		err := utils.ReadJsonRequest(r, &payload)

		if err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
			return
		}

		if err := utils.Validator.Struct(payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid payload", err)
			return
		}
		fmt.Println("Payload recieved for Create User request: ", payload)

		reqContext := r.Context()

		ctx := context.WithValue(reqContext, "payload", payload)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
