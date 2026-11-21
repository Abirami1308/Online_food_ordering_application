package com.examly.springapp.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.examly.springapp.model.Menu;
import com.examly.springapp.repository.MenuRepository;
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
public class MenuService {

    @org.springframework.beans.factory.annotation.Autowired
    private MenuRepository menuRepository;

    public Menu saveMenu(Menu menu) {
        if (menu != null) {
            menu.setId(null);
        }
        return menuRepository.save(menu);
    }

    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    public Menu getMenuById(Long id) {
        return menuRepository.findById(id).orElse(null);
    }

    public Menu updateMenu(Long id, Menu updatedMenu) {
        Menu menu = menuRepository.findById(id).orElse(null);
        if (menu == null) {
            return null;
        }
        menu.setItemName(updatedMenu.getItemName());
        menu.setDescription(updatedMenu.getDescription());
        menu.setPrice(updatedMenu.getPrice());
        menu.setCategory(updatedMenu.getCategory());
        menu.setIsAvailable(updatedMenu.getIsAvailable());
        menu.setRestaurantId(updatedMenu.getRestaurantId());
        return menuRepository.save(menu);
    }

    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }
}
