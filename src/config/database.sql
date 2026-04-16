-- create database passai
create database passaidb; 

-- creating a user table
create table if not exists users (
	user_id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(255) UNIQUE NULL,
    user_join_date TIMESTAMP default current_timestamp
)

-- creating a user_history table with index
create table if not exists user_history (
	h_id INT PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(255),
    university_name VARCHAR(255),
	subject_name VARCHAR(255),
    branch_name VARCHAR(255),
    subject_code VARCHAR(255),
	paper_year VARCHAR(255),
    result_json JSON,
    search_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
	FOREIGN KEY(uuid) REFERENCES users(uuid),
    INDEX idx_uuid(uuid)

)

-- adding a constaint to user_history table to link with users table
alter table user_history
add constraint user_history_ibfk_1 foreign key(user_id) references users(user_id) on delete cascade;

