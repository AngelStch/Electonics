const Electronic = require("../models/Electronic.js");

exports.create = (electronicData) => Electronic.create(electronicData);

exports.getAll =() => Electronic.find();

exports.singleElectronic = (electronicId) => Electronic.findById(electronicId).populate('buyingList')

exports.updateElectronic = (electronicId, electronicData) => Electronic.findByIdAndUpdate(electronicId, electronicData)

exports.deleteElectronic = (electronicId) => Electronic.findByIdAndDelete(electronicId)

exports.addToBuyingList = async (electronicId,userId) =>{
    const electronic = await this.singleElectronic(electronicId)
    const isExistingInBuy = electronic.buyingList.some((v) =>  v?.toString() === userId)
    if(isExistingInBuy){
         return
    }
    electronic.buyingList.push(userId)
    return electronic.save()
}

exports.getFilteredElectronics = async ( Name, Type ) => {
    let filterElectrnics = await Electronic.find().lean();
    if(!Name && !Type){
        return filterElectrnics;
    }
    else if(!Name && Type){
        filterElectrnics = filterElectrnics.filter((electronic) =>
        electronic.type.toLowerCase().includes(Type.toLowerCase())
      );
    
    }
    else if(Name && !Type){
        filterElectrnics = filterElectrnics.filter((electronic) =>
        electronic.name.toLowerCase().includes(Name.toLowerCase())
      );
    
    }
    else if (Name && Type) {
      let filterElectrnics1 = filterElectrnics.filter((electronic) =>
      electronic.name.toLowerCase().includes(Name.toLowerCase())
      );
      filterElectrnics =filterElectrnics1.filter((electronic) =>
      electronic.name.toLowerCase().includes(Type.toLowerCase()));
    }
    return filterElectrnics;
  };
