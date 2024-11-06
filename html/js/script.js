// Simulated function to update the plant state (replace with ESP32 data input)
function updatePlantState(needsWater, needsSunlight) {
    const plant = document.getElementById("plant");
  
    // Remove all states initially
    plant.classList.remove("dehydrated", "low-sunlight");
  
    // Apply "dehydrated" class if the plant needs water
    if (needsWater) {
      plant.classList.add("dehydrated");
    }
  
    // Apply "low-sunlight" class if the plant needs sunlight
    if (needsSunlight) {
      plant.classList.add("low-sunlight");
    }
  }
  
  // Example: Simulate data changes every 5 seconds
  setInterval(() => {
    // Simulated sensor data (replace with actual sensor readings)
    const needsWater = Math.random() > 0.5; // Randomly true or false
    const needsSunlight = Math.random() > 0.5; // Randomly true or false
  
    // Update the plant based on simulated data
    updatePlantState(needsWater, needsSunlight);
  }, 5000);
  