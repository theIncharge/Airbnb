package db

import (
	"AuthInGo/models"
	"database/sql"
	"fmt"
)

type UserRepository interface {
	GetById(id string) (*models.User, error)
	Create(username string, email string, hashedPassword string) (*models.User, error)
	GetByEmail(email string) (*models.User, error)
	GetAll() ([]*models.User, error)
	DeleteById(id int64) error
}

type UserRepositoryImpl struct {
	db *sql.DB
}

func NewUserRepository(_db *sql.DB) UserRepository {
	return &UserRepositoryImpl{
		db: _db,
	}
}

func (u *UserRepositoryImpl) GetById(id string) (*models.User, error) {
	fmt.Println("Fetching user in UserRepository")

	// Step 1: Prepare the query
	query := "SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?"

	// Step 2: Execute the query

	fmt.Println(id, "  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")

	row := u.db.QueryRow(query, id)
	fmt.Println(".....................................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

	// Step 3: Process the result
	user := &models.User{}

	err := row.Scan(&user.Id, &user.Username, &user.Email, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No user found with the given ID")
			return nil, err
		} else {
			fmt.Println("Error scanning user:", err)
			return nil, err
		}
	}

	// Step 4: Print the user details
	fmt.Println("User fetched successfully:", user)

	return user, nil
}

func (u *UserRepositoryImpl) Create(username string, email string, hashedPassword string) (*models.User, error) {
	query := "INSERT INTO users (username,email,password) VALUES (?,?,?)"

	result, err := u.db.Exec(query, username, email, hashedPassword)

	if err != nil {
		fmt.Println("Error executing query: ", err)
		return nil, err
	}
	rowsAffected, rowError := result.RowsAffected()

	if rowError != nil {
		fmt.Println("Error getting row affected: ", err)
		return nil, rowError
	}

	if rowsAffected == 0 {
		fmt.Println("No rows were affected , user was not created")
		return nil, fmt.Errorf("No rows were affected, user not created")
	}
	id, err := result.LastInsertId()
	if err != nil {
		fmt.Println("Can not get the last inserted id")
	}

	user := &models.User{
		Id:       id,
		Username: username,
		Email:    email,
	}

	fmt.Println("User created successfully,rows affected")

	return user, nil

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

func (u *UserRepositoryImpl) GetAll() ([]*models.User, error) {
	query := `SELECT id,username,email,created_at,updated_at FROM users`
	rows, err := u.db.Query(query)

	if err != nil {
		fmt.Println("Error fetching users")
		return nil, err
	}

	defer rows.Close()
	var users []*models.User

	for rows.Next() {
		user := &models.User{}
		err := rows.Scan(&user.Id, &user.Username, &user.Email, &user.CreatedAt, &user.UpdatedAt)

		if err != nil {
			fmt.Println("Error scanning the users: ", err)
			return nil, err
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		fmt.Println("Error with rows: ", err)
		return nil, err
	}
	return users, nil

}
func (u *UserRepositoryImpl) DeleteById(id int64) error {
	query := `DELETE FROM users WHERE id=?`
	result, err := u.db.Exec(query, id)
	if err != nil {
		fmt.Println("Error deleting rows: ", err)
		return err
	}

	rowsEffected, err := result.RowsAffected()

	if err != nil {
		fmt.Println("Error getting rows affected")
		return err
	}

	if rowsEffected == 0 {
		fmt.Println("Rows effected is 0")
		return fmt.Errorf("Rows Effected is zero")
	}

	fmt.Println("User deleted succesfully, rows affeccted: ", rowsEffected)
	return nil

}
