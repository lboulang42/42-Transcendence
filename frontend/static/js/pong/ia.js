// Function to predict the collision point of the ball with the screen edge
export function predictBallcollision(ball, size_renderer) {
    // Extract height and width from the renderer size
    let height = size_renderer.height;
    let width = size_renderer.width;

    // Calculate the current position of the ball relative to the screen
    let bally = ball.mesh.position.y + (size_renderer.height / 2);
    let ballx = ball.mesh.position.x + (size_renderer.width / 2);

    // Extract the ball's direction in the x-axis
    let balldirectionx = ball.direction.x;

    // If the ball is moving to the left, return the current y position of the ball
    if (balldirectionx < 0) {
        return(ball.mesh.position.y);
    }

    // If the ball's x direction is zero, set a minimal positive direction
    if (balldirectionx == 0) {
        balldirectionx = 0.01;
    }

    // Estimate the time required for the ball to reach the right edge of the screen
    let estimationTime = (width - ballx) / Math.abs(ball.direction.x);

    // Estimate the new y position of the ball after the estimated time
    let heightCollision = (bally + ball.direction.y * estimationTime);

    // Adjust the y position if the ball bounces off the top or bottom edges
    if (heightCollision < 10) {
        heightCollision = -heightCollision; // Reflect off the bottom edge
    }
    if (heightCollision >= height - 10) {
        heightCollision = 2 * height - heightCollision; // Reflect off the top edge
    }

    // Return the adjusted y position relative to the center of the screen
    return (heightCollision - (height / 2));
}

// Function to predict the collision point of the ball with the screen edge, considering paddle height
export function predictBallcollision2(ball, size_renderer) {
    // Extract height and width from the renderer size
    let height = size_renderer.height;
    let width = size_renderer.width;

    // Calculate the current position of the ball relative to the screen
    let bally = ball.mesh.position.y + (size_renderer.height / 2);
    let ballx = ball.mesh.position.x + (size_renderer.width / 2);

    // Define the paddle height as one-fifth of the screen height
    let paddleHeight = height / 5;

    // Extract the ball's direction in the x-axis
    let balldirectionx = ball.direction.x;

    // If the ball is moving to the left, return the current y position of the ball
    if (balldirectionx < 0) {
        return(ball.mesh.position.y);
    }

    // If the ball's x direction is zero, set a minimal positive direction
    if (balldirectionx == 0) {
        balldirectionx = 0.01;
    }

    // Estimate the time required for the ball to reach the right edge of the screen
    let estimationTime = (width - ballx) / Math.abs(ball.direction.x);

    // Estimate the new y position of the ball after the estimated time
    let heightCollision = (bally + ball.direction.y * estimationTime);

    // Adjust the y position if the ball bounces off the top or bottom edges
    if (heightCollision < 10) {
        heightCollision = -heightCollision; // Reflect off the bottom edge
    }
    if (heightCollision >= height - 10) {
        heightCollision = 2 * height - heightCollision; // Reflect off the top edge
    }

    // Adjust the y position considering the paddle height
    if ((heightCollision - (height / 2)) > 0) {
        return (heightCollision - (height / 2) - paddleHeight / 8 * 3);
    }
    if ((heightCollision - (height / 2)) <= 0) {
        return (heightCollision - (height / 2) + paddleHeight / 8 * 3);
    }
    
    // Return the adjusted y position relative to the center of the screen
    return (heightCollision - (height / 2));
}

