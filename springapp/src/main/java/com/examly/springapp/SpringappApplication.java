package com.examly.springapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.examly.springapp.repository.RestaurantRepository;
import com.examly.springapp.repository.MenuRepository;
import com.examly.springapp.model.Restaurant;
import com.examly.springapp.model.Menu;
import java.util.List;

@SpringBootApplication
public class SpringappApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringappApplication.class, args);
    }

    @Bean
    public CommandLineRunner dataSeeder(RestaurantRepository restaurantRepo, MenuRepository menuRepo) {
        return args -> {
            List<Restaurant> existingRestaurants = restaurantRepo.findAll();
            List<Menu> existingMenus = menuRepo.findAll();

            // 1. Sree Annapoorna
            Restaurant r1 = getOrCreateRestaurant(restaurantRepo, existingRestaurants, "Sree Annapoorna", "South Indian", "Mettupalayam Rd, Coimbatore", "9876501234", 4.7);
            seedMenu(menuRepo, existingMenus, "Plain Dosa", "Crispy rice crepe served with coconut chutney and sambar.", 60.0, "South Indian", r1.getId());
            seedMenu(menuRepo, existingMenus, "Ghee Roast Dosa", "Crispy crepe cooked with aromatic clarified butter.", 90.0, "South Indian", r1.getId());
            seedMenu(menuRepo, existingMenus, "Masala Dosa", "Dosa stuffed with lightly spiced potato mash.", 100.0, "South Indian", r1.getId());
            seedMenu(menuRepo, existingMenus, "Idli Sambar", "Soft steamed rice cakes served with hot lentil sambar.", 60.0, "South Indian", r1.getId());
            seedMenu(menuRepo, existingMenus, "Idli Vada Combo", "Two idlis and one crispy medu vada with chutney.", 80.0, "South Indian", r1.getId());
            seedMenu(menuRepo, existingMenus, "Pongal", "Traditional South Indian rice and lentil dish tempered with ghee and black pepper.", 75.0, "South Indian", r1.getId());
            seedMenu(menuRepo, existingMenus, "Poori Masala", "Fluffy deep-fried wheat breads served with potato masala.", 85.0, "South Indian", r1.getId());
            seedMenu(menuRepo, existingMenus, "Medu Vada", "Crispy fried lentil donuts seasoned with pepper and curry leaves.", 50.0, "South Indian", r1.getId());

            // 2. The Terracotta Table
            Restaurant r2 = getOrCreateRestaurant(restaurantRepo, existingRestaurants, "The Terracotta Table", "Multi Cuisine", "Race Course, Coimbatore", "9876505678", 4.5);
            seedMenu(menuRepo, existingMenus, "Alfredo Pasta", "Rich creamy white sauce pasta loaded with parmesan.", 280.0, "Italian", r2.getId());
            seedMenu(menuRepo, existingMenus, "Grilled Chicken", "Succulent chicken breast grilled to perfection with herbs.", 350.0, "Main Course", r2.getId());
            seedMenu(menuRepo, existingMenus, "Paneer Tikka Butter Masala", "Cottage cheese tikkas in rich creamy tomato gravy.", 260.0, "North Indian", r2.getId());
            seedMenu(menuRepo, existingMenus, "Veg Club Sandwich", "Triple decker toasted sandwich filled with fresh vegetables.", 150.0, "Snacks", r2.getId());
            seedMenu(menuRepo, existingMenus, "Chicken Caesar Salad", "Crisp lettuce tossed with Caesar dressing, croutons, and grilled chicken.", 220.0, "Salad", r2.getId());
            seedMenu(menuRepo, existingMenus, "Hakka Noodles", "Stir-fried noodles with crisp vegetables and soy sauce.", 180.0, "Asian", r2.getId());
            seedMenu(menuRepo, existingMenus, "Schezwan Fried Rice", "Spicy fried rice tossed in house-made Schezwan sauce.", 190.0, "Asian", r2.getId());
            seedMenu(menuRepo, existingMenus, "Garlic Bread with Cheese", "Freshly baked bread with garlic butter and melted mozzarella.", 140.0, "Appetizers", r2.getId());

            // 3. BMS Biryani
            Restaurant r3 = getOrCreateRestaurant(restaurantRepo, existingRestaurants, "BMS Biryani", "Biryani", "Avinashi Rd, Coimbatore", "9876509999", 4.6);
            seedMenu(menuRepo, existingMenus, "Chicken Biryani", "Fragrant basmati rice layered with spiced chicken and saffron.", 220.0, "Biryani", r3.getId());
            seedMenu(menuRepo, existingMenus, "Mutton Biryani", "Slow-cooked traditional mutton biryani with aromatic spices.", 280.0, "Biryani", r3.getId());
            seedMenu(menuRepo, existingMenus, "Egg Biryani", "Delicious long grain rice seasoned with spices and boiled eggs.", 160.0, "Biryani", r3.getId());
            seedMenu(menuRepo, existingMenus, "Veg Biryani", "Medley of fresh vegetables cooked with fragrant basmati rice.", 140.0, "Biryani", r3.getId());
            seedMenu(menuRepo, existingMenus, "Chicken 65", "Spicy, deep-fried chicken chunks marinated in red chili paste.", 180.0, "Starters", r3.getId());
            seedMenu(menuRepo, existingMenus, "Pepper Chicken", "Dry chicken dish loaded with black pepper and curry leaves.", 200.0, "Starters", r3.getId());
            seedMenu(menuRepo, existingMenus, "Chicken Tikka", "Tandoor grilled chicken chunks marinated in yogurt spices.", 220.0, "Starters", r3.getId());

            // 4. Junior Kuppanna
            Restaurant r4 = getOrCreateRestaurant(restaurantRepo, existingRestaurants, "Junior Kuppanna", "South Indian / Chettinad", "Gandhipuram, Coimbatore", "9876502222", 4.5);
            seedMenu(menuRepo, existingMenus, "Seeraga Samba Chicken Biryani", "Kuppanna style biryani made with premium Seeraga Samba rice.", 240.0, "Biryani", r4.getId());
            seedMenu(menuRepo, existingMenus, "Seeraga Samba Mutton Biryani", "Traditional Chettinad style mutton biryani.", 290.0, "Biryani", r4.getId());
            seedMenu(menuRepo, existingMenus, "Chettinad Chicken 65", "Authentic spicy fried chicken flavored with Chettinad spices.", 190.0, "Starters", r4.getId());
            seedMenu(menuRepo, existingMenus, "Parotta", "Layered flaky flatbread made from refined flour.", 40.0, "Breads", r4.getId());
            seedMenu(menuRepo, existingMenus, "Kuppanna Chicken Curry", "Rich spicy gravy made in traditional Kuppanna style.", 220.0, "Main Course", r4.getId());
            seedMenu(menuRepo, existingMenus, "Kuppanna Mutton Curry", "Succulent mutton cooked in flavorful Chettinad gravy.", 260.0, "Main Course", r4.getId());
            seedMenu(menuRepo, existingMenus, "Egg Parotta", "Flaky parotta shredded and tossed with scrambled eggs and spices.", 100.0, "Main Course", r4.getId());

            // 5. Hari Bhavanam
            Restaurant r5 = getOrCreateRestaurant(restaurantRepo, existingRestaurants, "Hari Bhavanam", "South Indian", "Peelamedu, Coimbatore", "9876503333", 4.6);
            seedMenu(menuRepo, existingMenus, "Special Masala Dosa", "Slightly larger golden crepe filled with potato masala.", 100.0, "South Indian", r5.getId());
            seedMenu(menuRepo, existingMenus, "Onion Dosa", "Dosa topped with finely chopped onions and green chilies.", 110.0, "South Indian", r5.getId());
            seedMenu(menuRepo, existingMenus, "Paneer Dosa", "Dosa stuffed with spiced grated cottage cheese.", 140.0, "South Indian", r5.getId());
            seedMenu(menuRepo, existingMenus, "Mini Tiffin", "Mini idli, pongal, mini dosa, and sweet served together.", 120.0, "South Indian", r5.getId());
            seedMenu(menuRepo, existingMenus, "Hari Pongal", "Ghee-rich rice & lentil pongal garnished with cashews.", 80.0, "South Indian", r5.getId());
            seedMenu(menuRepo, existingMenus, "Vada Curry", "Flavorful lentil dumpling curry, a perfect side for parotta or dosa.", 100.0, "South Indian", r5.getId());
            seedMenu(menuRepo, existingMenus, "South Indian Meals", "Full course meal with rice, sambar, rasam, kootu, poriyal, and appalam.", 180.0, "South Indian", r5.getId());

            // 6. That's Y Food
            Restaurant r6 = getOrCreateRestaurant(restaurantRepo, existingRestaurants, "That's Y Food", "Fast Food", "R.S. Puram, Coimbatore", "9876504444", 4.4);
            seedMenu(menuRepo, existingMenus, "Veg Burger", "Crispy veg patty burger with mayo, lettuce, and tomato.", 129.0, "Fast Food", r6.getId());
            seedMenu(menuRepo, existingMenus, "Chicken Burger", "Succulent chicken patty with melted cheese and fresh greens.", 169.0, "Fast Food", r6.getId());
            seedMenu(menuRepo, existingMenus, "French Fries", "Salted classic golden potato fries.", 99.0, "Fast Food", r6.getId());
            seedMenu(menuRepo, existingMenus, "Peri Peri Fries", "Fries tossed in spicy Peri Peri seasoning.", 129.0, "Fast Food", r6.getId());
            seedMenu(menuRepo, existingMenus, "Chicken Wrap", "Spiced grilled chicken and veggies wrapped in a soft tortilla.", 159.0, "Fast Food", r6.getId());
            seedMenu(menuRepo, existingMenus, "Paneer Wrap", "Tortilla wrap filled with spiced paneer tikkas and mint mayo.", 139.0, "Fast Food", r6.getId());
            seedMenu(menuRepo, existingMenus, "Cheese Sandwich", "Grilled sandwich loaded with cheddar and mozzarella cheese.", 119.0, "Fast Food", r6.getId());

            // 7. Cafe Coffee Day
            Restaurant r7 = getOrCreateRestaurant(restaurantRepo, existingRestaurants, "Cafe Coffee Day", "Cafe", "Sai Baba Colony, Coimbatore", "9876505555", 4.2);
            seedMenu(menuRepo, existingMenus, "Cappuccino", "Classic Italian hot coffee drink with espresso and steamed milk foam.", 140.0, "Cafe", r7.getId());
            seedMenu(menuRepo, existingMenus, "Cafe Latte", "Smooth espresso with lots of steamed milk and a light layer of foam.", 150.0, "Cafe", r7.getId());
            seedMenu(menuRepo, existingMenus, "Cold Coffee", "Rich creamy blended cold coffee served with vanilla ice cream.", 160.0, "Cafe", r7.getId());
            seedMenu(menuRepo, existingMenus, "Chocolate Frappe", "Ice blended chocolate drink topped with whipped cream.", 190.0, "Cafe", r7.getId());
            seedMenu(menuRepo, existingMenus, "Veg Sandwich", "Fresh cucumber, tomato, and cheese sandwich in multi-grain bread.", 140.0, "Cafe", r7.getId());
            seedMenu(menuRepo, existingMenus, "Chicken Sandwich", "Shredded chicken tossed with pepper mayo inside toasted bread.", 170.0, "Cafe", r7.getId());
            seedMenu(menuRepo, existingMenus, "Chocolate Brownie", "Fudgy chocolate brownie served warm.", 120.0, "Cafe", r7.getId());

            // 8. Pizza Corner
            Restaurant r8 = getOrCreateRestaurant(restaurantRepo, existingRestaurants, "Pizza Corner", "Italian / Pizza", "Town Hall, Coimbatore", "9876506666", 4.3);
            seedMenu(menuRepo, existingMenus, "Margherita Pizza", "Classic cheese pizza with fresh basil and tomato sauce.", 199.0, "Italian / Pizza", r8.getId());
            seedMenu(menuRepo, existingMenus, "Farmhouse Pizza", "Pizza loaded with mushrooms, capsicum, tomatoes, and onions.", 299.0, "Italian / Pizza", r8.getId());
            seedMenu(menuRepo, existingMenus, "Paneer Tikka Pizza", "Pizza topped with tandoori paneer cubes and red onions.", 329.0, "Italian / Pizza", r8.getId());
            seedMenu(menuRepo, existingMenus, "Chicken Tikka Pizza", "Pizza topped with spicy chicken tikka and green chilies.", 349.0, "Italian / Pizza", r8.getId());
            seedMenu(menuRepo, existingMenus, "Veggie Supreme Pizza", "Combination of black olives, baby corn, capsicum, and onions.", 319.0, "Italian / Pizza", r8.getId());
            seedMenu(menuRepo, existingMenus, "Garlic Bread", "Garlic seasoned toasted bread slices.", 149.0, "Italian / Pizza", r8.getId());
            seedMenu(menuRepo, existingMenus, "Cheese Burst Pizza", "Pizza loaded with liquid cheese inside the crust.", 379.0, "Italian / Pizza", r8.getId());

            // 9. The Bowl House
            Restaurant r9 = getOrCreateRestaurant(restaurantRepo, existingRestaurants, "The Bowl House", "Asian", "Saravanampatti, Coimbatore", "9876507777", 4.4);
            seedMenu(menuRepo, existingMenus, "Chicken Teriyaki Bowl", "Grilled chicken in sweet teriyaki sauce over steamed rice.", 249.0, "Asian", r9.getId());
            seedMenu(menuRepo, existingMenus, "Veg Asian Bowl", "Stir fried seasonal greens in garlic sauce with jasmine rice.", 199.0, "Asian", r9.getId());
            seedMenu(menuRepo, existingMenus, "Paneer Rice Bowl", "Spiced paneer and bell peppers served over herb rice.", 219.0, "Asian", r9.getId());
            seedMenu(menuRepo, existingMenus, "Chicken Fried Rice", "Stir-fried rice with chicken chunks, egg, and green onions.", 189.0, "Asian", r9.getId());
            seedMenu(menuRepo, existingMenus, "Veg Fried Rice", "Classic fried rice with carrots, peas, and spring onions.", 159.0, "Asian", r9.getId());
            seedMenu(menuRepo, existingMenus, "Chicken Noodles", "Soft hakka noodles stir fried with chicken and cabbage.", 199.0, "Asian", r9.getId());
            seedMenu(menuRepo, existingMenus, "Spring Rolls", "Deep fried vegetable rolls served with sweet chili sauce.", 129.0, "Asian", r9.getId());

            // 10. Spice Route
            Restaurant r10 = getOrCreateRestaurant(restaurantRepo, existingRestaurants, "Spice Route", "North Indian", "Singanallur, Coimbatore", "9876508888", 4.5);
            seedMenu(menuRepo, existingMenus, "Butter Chicken", "Tender chicken in rich creamy tomato and butter gravy.", 249.0, "North Indian", r10.getId());
            seedMenu(menuRepo, existingMenus, "Paneer Butter Masala", "Cottage cheese cubes in rich spiced creamy gravy.", 199.0, "North Indian", r10.getId());
            seedMenu(menuRepo, existingMenus, "Dal Tadka", "Yellow lentils tempered with cumin, garlic, and red chilies.", 149.0, "North Indian", r10.getId());
            seedMenu(menuRepo, existingMenus, "Tandoori Chicken Tikka", "Yogurt-marinated chicken skewers grilled in tandoor.", 229.0, "North Indian", r10.getId());
            seedMenu(menuRepo, existingMenus, "Garlic Naan", "Tandoori flatbread flavored with minced garlic and butter.", 60.0, "North Indian", r10.getId());
            seedMenu(menuRepo, existingMenus, "Butter Naan", "Soft leavened tandoor flatbread glazed with butter.", 50.0, "North Indian", r10.getId());
            seedMenu(menuRepo, existingMenus, "Veg Thali", "North Indian style meal with dal, paneer, dry veg, rice, naan, and sweet.", 199.0, "North Indian", r10.getId());
            seedMenu(menuRepo, existingMenus, "Chicken Thali", "Meal featuring chicken curry, dal, dry veg, rice, naan, and sweet.", 249.0, "North Indian", r10.getId());

            System.out.println("--- Database Data Seeded and Checked Successfully ---");
        };
    }

    private Restaurant getOrCreateRestaurant(RestaurantRepository repo, List<Restaurant> existing, String name, String cuisine, String address, String phone, Double rating) {
        for (Restaurant r : existing) {
            if (r.getName().equalsIgnoreCase(name)) {
                return r;
            }
        }
        Restaurant newRest = Restaurant.builder()
                .name(name)
                .cuisineType(cuisine)
                .address(address)
                .phoneNumber(phone)
                .rating(rating)
                .isActive(true)
                .build();
        newRest = repo.save(newRest);
        existing.add(newRest);
        return newRest;
    }

    private void seedMenu(MenuRepository repo, List<Menu> existing, String name, String desc, Double price, String category, Long restId) {
        for (Menu m : existing) {
            if (m.getItemName().equalsIgnoreCase(name) && m.getRestaurantId().equals(restId)) {
                return;
            }
        }
        Menu newMenu = Menu.builder()
                .itemName(name)
                .description(desc)
                .price(price)
                .category(category)
                .isAvailable(true)
                .restaurantId(restId)
                .build();
        repo.save(newMenu);
    }
}
