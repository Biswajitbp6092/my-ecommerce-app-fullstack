import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (request, response) => {
  try {
    const {
      address_line,
      city,
      state,
      pin_code,
      country,
      mobile,
      userId,
      landmark,
      addresType,
    } = request.body;

    // if (!address_line || city || state || pin_code || country || mobile || userId) {
    //   return response.status(500).json({
    //     message: "Please Provide all the Fields",
    //     error: true,
    //     success: false,
    //   });
    // }

    const address = new AddressModel({
      address_line,
      city,
      state,
      pin_code,
      country,
      mobile,
      userId,
      landmark,
      addresType,
    });

    const saveAddress = await address.save();

    const updateAddress = await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          address_details: saveAddress?._id,
        },
      }
    );
    return response.status(200).json({
      data: saveAddress,
      message: "Address add Sucessfuly",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// export const getAddressController = async (request, response) => {
//   try {
//     const address = await AddressModel.find({ userId: request?.query?.userId });
//     if (!address) {
//       return response.status(404).json({
//         error: true,
//         success: false,
//         message: "address not Found",
//       });
//     } else {
//       const updateUser = await UserModel.updateOne(
//         { _id: request?.query?.userId },
//         {
//           $push: {
//             address: address?._id,
//           },
//         }
//       );
//       return response.status(200).json({
//         error: false,
//         success: true,
//         address: address,
//       });
//     }
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };
export const getAddressController = async (request, response) => {
  try {
    const address = await AddressModel.find({ userId: request?.query?.userId });

    if (!address) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "address not found",
      });
    } else {
      const updateUser = await UserModel.updateOne(
        { _id: request?.query?.userId },
        {
          $push: {
            Address: address?._id,
          },
        }
      );
      return response.status(200).json({
        error: true,
        success: false,
        data: address,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// export const selectAddressController = async (request, response) => {
//   try {
//     const userId = request.userId;

//     const address = await AddressModel.find({
//       _id: request.params.id,
//       userId: userId,
//     });

//     const updateAddress = await AddressModel.find(
//       {
//         userId:userId
//       }
//     );

//     if (!address) {
//       return response.status(404).json({
//         message: error.message || error,
//         error: true,
//         success: false,
//       });
//     } else {
//       const updateAddress = await AddressModel.findByIdAndUpdate(
//         request.params.id,
//         {
//           selected: request?.body?.selected,
//         },
//         { new: true }
//       );
//       return response.json({
//         error: false,
//         success: true,
//         address: updateAddress,
//       });
//     }
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// };

export const deleteAddressController = async (request, response) => {
  try {
    const userId = request.user.id;
    const _id = request.params.id;

    if (!_id) {
      return response.status(400).json({
        message: "Provide _id",
        error: true,
        success: false,
      });
    }

    const deleteItem = await AddressModel.deleteOne({
      _id: _id,
      userId: userId,
    });

    if (!deleteItem) {
      return response.status(400).json({
        message: "The address in the database is not found",
        error: true,
        success: false,
      });
    }

    await UserModel.updateOne(
      { _id: userId },
      { $pull: { address_details: _id } }
    );

    return response.status(200).json({
      message: "Address remove",
      success: true,
      error: false,
      data: deleteItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getSingleAddressController = async (request, response) => {
  try {
    const id = request.params.id;

    const address = await AddressModel.findOne({ _id: id });

    if (!address) {
      return response.status(404).json({
        message: "Address not Found",
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      address: address,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//update user details
export async function editAddress(request, response) {
  try {
    const id = request.params.id;
    const {
      address_line,
      city,
      state,
      pin_code,
      country,
      mobile,
      userId,
      landmark,
      addresType,
    } = request.body;

    const address = await AddressModel.findByIdAndUpdate(
      id,
      {
        address_line: address_line,
        city: city,
        state: state,
        pin_code: pin_code,
        country: country,
        mobile: mobile,
        landmark: landmark,
        addresType: addresType,
      },
      { new: true }
    );

    return response.json({
      message: "Address Update Successfully",
      error: false,
      success: true,
      address: address,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
