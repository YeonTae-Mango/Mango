package com.mango.backend.domain.userphoto.repository;

import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.userphoto.entity.UserPhoto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPhotoRepository extends JpaRepository<UserPhoto, Long> {

  List<UserPhoto> findByUserOrderByPhotoOrderAsc(User user);

}
