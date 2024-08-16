create table role (
    role_id int unsigned not null auto_increment primary key,
    role_name varchar(255) not null
);

create table user (
    user_id int unsigned not null auto_increment primary key,
    username varchar(255) not null,
    password varchar(255) not null,
    full_name varchar(255) null,
    email varchar(255) null,
    status tinyint(1) null,
    img varchar(255) null,
    role_id int unsigned not null,

    constraint user_role_id_foreign foreign key (role_id) references role(role_id)
);

create table session (
    session_id int unsigned not null auto_increment primary key,
    name text null,
    start_time datetime not null,
    end_time datetime null,
    user_id int unsigned not null,

    constraint session_user_id_foreign foreign key (user_id) references user(user_id)
);

create table message (
    qa_id int unsigned not null auto_increment primary key,
    session_id int unsigned not null,
    question text not null,
    answer text not null,
    question_time datetime not null,
    answer_time datetime not null,
    comment text null,
    star int null,
    message_summary longtext null,

    constraint message_session_id_foreign foreign key (session_id) references session(session_id)
);

CREATE TABLE chat_with_emloyee (
    id int unsigned not null auto_increment primary key,
    messenger varchar(255) not null,
    emloyee tinyint(1) not null,
    status tinyint(1) not null,
    datetime datetime not null,
    user_id int unsigned not null,

    constraint chat_with_emloyee_user_id_foreign foreign key (user_id) references user(user_id)
);

insert into role (role_id, role_name) values ('1', 'admin');
insert into user (user_id, username, password, full_name, role_id) values ('1', 'u1', '1', 'User', '1');

