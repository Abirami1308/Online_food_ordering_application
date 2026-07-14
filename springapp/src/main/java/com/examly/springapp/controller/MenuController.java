package com.examly.springapp.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.examly.springapp.model.Menu;
import com.examly.springapp.service.MenuService;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Menus", description = "Menu APIs")
@RestController
@RequestMapping("/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @Operation(summary = "Get all menus", description = "Returns all menus from the database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Menus retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<List<Menu>> getAllMenus() {
        List<Menu> menus = menuService.getAllMenus();
        return ResponseEntity.ok(menus);
    }

    @Operation(summary = "Get menu by ID", description = "Returns a menu using its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Menu found"),
            @ApiResponse(responseCode = "404", description = "Menu not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Menu> getMenuById(@PathVariable Long id) {
        try {
            Menu menu = menuService.getMenuById(id);
            if (menu == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(menu);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Create a menu", description = "Creates a new menu")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Menu created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body")
    })
    @PostMapping
    public ResponseEntity<Menu> createMenu(@RequestBody(required = false) Menu menu) {
        if (menu == null) {
            return ResponseEntity.badRequest().build();
        }
        Menu savedMenu = menuService.saveMenu(menu);
        return ResponseEntity.ok(savedMenu);
    }

    @Operation(summary = "Update a menu", description = "Updates an existing menu")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Menu updated successfully"),
            @ApiResponse(responseCode = "404", description = "Menu not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable Long id, @RequestBody Menu menu) {
        try {
            Menu updatedMenu = menuService.updateMenu(id, menu);
            if (updatedMenu == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedMenu);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete a menu", description = "Deletes a menu by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Menu deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Menu not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        try {
            menuService.deleteMenu(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
