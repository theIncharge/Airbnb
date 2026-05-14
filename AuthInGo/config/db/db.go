package config

import (
	config "AuthInGo/config/env"
	"database/sql"
	"fmt"

	"github.com/go-sql-driver/mysql"
)

func SetupDB() (*sql.DB, error) {
	cfg := mysql.NewConfig()
	cfg.User = config.GetString("DB_USER", "root")
	cfg.Passwd = config.GetString("DB_PASSWORD", "root")
	cfg.DBName = config.GetString("DB_NAME", "root")
	cfg.Net = config.GetString("DB_NET", "tcp")
	cfg.Addr = config.GetString("DB_ADDR", "127.0.0.1:3307")

	db, err := sql.Open("mysql", cfg.FormatDSN())

	if err != nil {
		fmt.Println("Error connecting tp database: ", err)
		return nil, err
	}

	fmt.Println("Trying to connect to database...")

	pingErr := db.Ping()
	if pingErr != nil {
		fmt.Println("Error pinging database: ", pingErr)
		return nil, err
	}

	fmt.Println("Database connected succesfully: ", cfg.DBName)

	return db, nil

}
