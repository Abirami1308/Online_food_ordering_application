package com.examly.springapp.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.examly.springapp.model.Review;
import com.examly.springapp.repository.ReviewRepository;
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
public class ReviewService {

    @org.springframework.beans.factory.annotation.Autowired
    private ReviewRepository reviewRepository;

    public Review saveReview(Review review) {
        if (review != null) {
            review.setId(null);
        }
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id).orElse(null);
    }

    public Review updateReview(Long id, Review updatedReview) {
        Review review = reviewRepository.findById(id).orElse(null);
        if (review == null) {
            return null;
        }
        review.setUserId(updatedReview.getUserId());
        review.setRestaurantId(updatedReview.getRestaurantId());
        review.setRating(updatedReview.getRating());
        review.setComment(updatedReview.getComment());
        return reviewRepository.save(review);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
