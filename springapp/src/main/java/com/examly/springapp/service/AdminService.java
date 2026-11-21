package com.examly.springapp.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.examly.springapp.model.Admin;
import com.examly.springapp.repository.AdminRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Service
public class AdminService {

    @org.springframework.beans.factory.annotation.Autowired
    private AdminRepository adminRepository;

    public Admin saveAdmin(Admin admin) {
        if (admin != null) {
            admin.setId(null);
        }
        return adminRepository.save(admin);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    public Admin updateAdmin(Long id, Admin updatedAdmin) {
        Admin admin = adminRepository.findById(id).orElse(null);
        if (admin == null) {
            return null;
        }
        admin.setUsername(updatedAdmin.getUsername());
        admin.setEmail(updatedAdmin.getEmail());
        admin.setPassword(updatedAdmin.getPassword());
        admin.setRole(updatedAdmin.getRole());
        return adminRepository.save(admin);
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
}
