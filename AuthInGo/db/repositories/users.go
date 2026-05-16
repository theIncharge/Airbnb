package db

import (
	"AuthInGo/models"
	"database/sql"
	"fmt"
)

type UserRepository interface {
	GetById() (*models.User, error)
	Create(username string, email string, hashedPassword string) error
	GetByEmail(email string) (*models.User, error)
}

type UserRepositoryImpl struct {
	db *sql.DB
}

func NewUserRepository(_db *sql.DB) UserRepository {
	return &UserRepositoryImpl{
		db: _db,
	}
}

func (u *UserRepositoryImpl) GetById() (*models.User, error) {
	query := "SELECT id, username, email, password, created_at, updated_at FROM users WHERE id=?"

	row := u.db.QueryRow(query, 1)

	user := &models.User{}

	err := row.Scan(&user.Id, &user.Username, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No user found with given id")
			return nil, err
		} else {
			fmt.Println("Error scanning User: ", err)
			return nil, err
		}
	}

	fmt.Println("User Fetched successfully: ", user)

	return user, nil
}

func (u *UserRepositoryImpl) Create(username string, email string, hashedPassword string) error {
	query := "INSERT INTO users (username,email,password) VALUES (?,?,?)"

	result, err := u.db.Exec(query, username, email, hashedPassword)

	if err != nil {
		fmt.Println("Error executing query: ", err)
		return err
	}
	rowsAffected, rowError := result.RowsAffected()

	if rowError != nil {
		fmt.Println("Error getting row affected: ", err)
		return rowError
	}

	if rowsAffected == 0 {
		fmt.Println("No rows were affected , user was not created")
		return fmt.Errorf("No rows were affected, user not created")
	}

	fmt.Println("User created successfully,rows affected")

	return nil

}

func (u *UserRepositoryImpl) GetByEmail(email string) (*models.User, error) {

	query := `SELECT id,email,password FROM users where email =?`

	row := u.db.QueryRow(query, email)

	user := &models.User{}
	err := row.Scan(&user.Id, &user.Email, &user.Password)

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No such user exists")
			return nil, err
		}
		fmt.Println("Error querying database")
		return nil, err
	}

	return user, nil
}
