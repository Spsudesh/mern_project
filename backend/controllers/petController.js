const Pet = require('../models/petModel');

// Get all pets
exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pet by ID
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new pet
exports.createPet = async (req, res) => {
  console.log('CreatePet fields:', req.body);
  console.log('CreatePet file:', req.file?.originalname, req.file?.filename);
  const body = req.body;
  const picturePath = req.file ? `/uploads/${req.file.filename}` : body.picture;
  const pet = new Pet({
    ...body,
    picture: picturePath,
    age: Number(body.age),
    adoptionFee: Number(body.adoptionFee),
    vaccinated: body.vaccinated === 'true' || body.vaccinated === true,
    neutered: body.neutered === 'true' || body.neutered === true,
  });
  try {
    const newPet = await pet.save();
    res.status(201).json(newPet);
  } catch (error) {
    res.status(400).json({ message: error.message, details: error?.errors });
  }
};

// Update a pet
exports.updatePet = async (req, res) => {
  try {
    const body = req.body;
    const update = {
      ...body,
    };
    if (req.file) {
      update.picture = `/uploads/${req.file.filename}`;
    }
    if (body.age !== undefined) update.age = Number(body.age);
    if (body.adoptionFee !== undefined) update.adoptionFee = Number(body.adoptionFee);
    if (body.vaccinated !== undefined) update.vaccinated = body.vaccinated === 'true' || body.vaccinated === true;
    if (body.neutered !== undefined) update.neutered = body.neutered === 'true' || body.neutered === true;

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updatedPet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json(updatedPet);
  } catch (error) {
    res.status(400).json({ message: error.message, details: error?.errors });
  }
};

// Delete a pet
exports.deletePet = async (req, res) => {
  try {
    const deletedPet = await Pet.findByIdAndDelete(req.params.id);
    if (!deletedPet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json({ message: 'Pet deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};