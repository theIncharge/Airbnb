package router

import (
	"AuthInGo/controllers"

	"github.com/go-chi/chi"
)

type RoleRouter struct {
	roleController *controllers.RoleController
}

func NewRoleRouter(_roleController *controllers.RoleController) Router {
	return &RoleRouter{
		roleController: _roleController,
	}
}

func (rr *RoleRouter) Register(r chi.Router) {
	// Role CRUD operations
	r.Get("/roles/{id}", rr.roleController.GetRoleById)
	r.Get("/roles", rr.roleController.GetAllRoles)
	r.Post("/roles", rr.roleController.CreateRole)
	r.Put("/roles/{id}", rr.roleController.UpdateRole)
	r.Delete("/roles/{id}", rr.roleController.DeleteRole)

	// Role permissions operations
	r.Get("/roles/{id}/permissions", rr.roleController.GetRolePermissions)
	r.Post("/roles/{id}/permissions", rr.roleController.AssignPermissionToRole)
	r.Delete("/roles/{id}/permissions", rr.roleController.RemovePermissionFromRole)
	r.Get("/role-permissions", rr.roleController.GetAllRolePermissions)
	r.Post("/roles/{userId}/assign/{roleId}", rr.roleController.AssignRoleToUser)
}
