package com.userform.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.userform.model.Users;



public interface UserRepository extends JpaRepository<Users,Long>  {


	Users findByUsername(String username);
	 

}
