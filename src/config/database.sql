-- create database passai
create database passaidb; 

-- creating a user table
create table if not exists users (
	user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    user_email VARCHAR(255) UNIQUE NULL,
    user_join_date TIMESTAMP default current_timestamp
)

-- creating a user_history table with index
create table if not exists user_history (
	h_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    university_name VARCHAR(255) NOT NULL,
	subject_name VARCHAR(255) NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    subject_code VARCHAR(255) NOT NULL,
	paper_year VARCHAR(255) NOT NULL,
    result_json JSON NOT NULL,
    paper_name VARCHAR(255) NOT NULL,
    search_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
	FOREIGN KEY(user_id) REFERENCES users(user_id) on delete cascade,
    INDEX idx_uuid(user_id)

)

-- adding a constaint to user_history table to link with users table
alter table user_history
add constraint user_history_ibfk_1 foreign key(user_id) references users(user_id) on delete cascade;

-- creating a otp table
create table if not exists user_otp (
otp_id int primary key auto_increment,
user_id int not null,
otp_number varchar(255) not null,
otp_expiry timestamp not null,
is_used enum("yes","no") default "no",

foreign key(user_id) references users(user_id) on delete cascade,
index(user_id)

)

