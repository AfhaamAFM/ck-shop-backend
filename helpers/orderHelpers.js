const orderModel = require('../models/OrderModel')
const cartModel = require('../models/CartModel')
const userModel = require('../models/userModel')
const offerModel = require('../models/offerModel')

module.exports = {


    placeOrder: (user, orders) => {
        return new Promise(async (resolve, reject) => {
            const isOrder = await orderModel.findOne({ user })
            const user1 = await userModel.findOne({ _id: user })
            const { email } = user1
            if (isOrder) {



                const placeOrder = await orderModel.updateOne({ user }, { $addToSet: { orders } })
                cartModel.findOneAndUpdate({ user }, { $set: { cartItem: [] } }).then(res => {

                    return resolve(true)
                })
               

            } else {




                const newOrder = new orderModel({ user, orders, email })
                const savedOrder = await newOrder.save();
                cartModel.updateOne({ user }, { $set: { cartItem: [] } }).then(res => {
                    return resolve(savedOrder)

                })
                return resolve(true)


            }



        })



    },

    getOrders: (user) => {

        return new Promise(async (resolve, reject) => {
        //   await orderModel.updateOne({user},{$pull:{"orders":{'orders.orderStatus': null}}})
            const order = await orderModel.findOne({user})
            return resolve(order)

        })


    },

    getAllOrders: () => {
        console.log('reacccc');
        return new Promise(async (resolve, reject) => {

            const allOrders = await orderModel.aggregate([
                {$match: { 'orders.orderStatus':{ $ne: ''}}},

                { $unwind: '$orders' }
            ])

            resolve(allOrders)

        })

    },
    // Chnage order status

    changeOrderStatus: (user, orderId, orderStatus) => {
        return new Promise(async (resolve, reject) => {

            const setorderStatus = await orderModel.updateOne({ user, 'orders._id': orderId }, { $set: { 'orders.$.orderStatus': orderStatus } })
            return resolve(setorderStatus.acknowledged);

        })




    },

    // use cancel order start 

    userCancelOrder: (user, orderId) => {
        return new Promise(async (resolve, reject) => {
            console.log(orderId);
            console.log(user);
            const cancelOrder = await orderModel.updateOne({ user, 'orders._Id': orderId }, { $set: { 'orders.$.orderStatus': 'canceled' } })
            return resolve(cancelOrder.acknowledged)



        })


    },

    // user cancel order end
    // pay for order start

    payForOrder: (user, orderId, paymentId, paymentMethod, orderStatus) => {
        return new Promise(async (resolve, reject) => {

            const isOrder = await orderModel.find({ user })

            if (!isOrder) {
                return resolve({ response: 'use order not found' })
            }
            const date = new Date()
            const paymentResult = {

                payId: paymentId,
                payed_Date: date,
                status: 'paid'

            }

            orderModel.updateOne({ user, 'orders.orderId': orderId }, {
                $set: {

                    'orders.$.isPaid': true,
                    'orders.$.paymentMethod': paymentMethod,
                    'orders.$.orderStatus': orderStatus,
                    'orders.$.paymentResult': paymentResult


                }
            }).then(res => {
                cartModel.findOneAndUpdate({ user }, { $set: { cartItem: [] } }).then(res => {

                    return resolve(true)
                })
            })

        })
    },
    placeCashOnDelivary: (user, orderId, paymentMethod, orderStatus) => {

        return new Promise(async (resolve, reject) => {


            const isOrder = await orderModel.find({ user })

            if (!isOrder) {
                return resolve({ response: 'use order not found' })
            }

            orderModel.updateOne({ user, 'orders.orderId': orderId }, {
                $set: {


                    'orders.$.paymentMethod': paymentMethod,
                    'orders.$.orderStatus': orderStatus,

                }
            }).then(res => {
                cartModel.findOneAndUpdate({ user }, { $set: { cartItem: [] } }).then(res => {

                    return resolve(true)
                })
            })

        })

    },
    // count data for dashboard

    getCountData: () => {
        return new Promise(async (resolve, reject) => {

            const orderCount = await orderModel.aggregate([
                { $unwind: '$orders' },
                { $match: { 'orders.orderStatus': 'ordered' } },
                { $count: 'totalOrders' }
            ])
            const totalSales = orderModel.aggregate([
                { $unwind: '$orders' },
                { $match: { 'orders.orderStatus': 'delivered' } },
                {
                    "$group": {
                        "_id": "$orders.orderId",
                        "Total sum": { "$sum": '$orders.amount' }
                    }
                },
                { $project: { _id: 0 } }
            ])

            resolve({

                orderCount,
                totalSales
            })

        })

    },
    getSalesRangeReport: (fromDate, toDate) => {

        return new Promise(async (resolve, reject) => {

            const data = await orderModel.aggregate([
                { $unwind: '$orders' },
                { $match: { $and: [{ "orders.paymentResult.payed_Date": { $gte: new Date(fromDate) } }, { "orders.paymentResult.payed_Date": { $lte: new Date(toDate) } }, { 'orders.orderStatus': 'delivered' }, { 'amount': { $ne: 0 } }] } },
                { $project: { email: 1, 'orders.orderId': 1, 'orders.amount': 1, 'orders.orderItem': 1, 'orders.paymentResult': 1 } }
            ])

            resolve(data)



        })

    },

    getReportData: (type) => {
    
        const numberOfDays = type === 'Daily' ? 1 : type === 'Weekly' ? 7 : type === 'Monthly' ? 30 : type === 'Yearly' ? 365 : 0
        const dayOfYear = (date) =>
            Math.floor(
                (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
            )
        return new Promise(async (resolve, reject) => {
            let report = await orderModel.aggregate(
                [

                    {
                        $unwind: '$orders'
                    },

                    { $match: { $and: [{"orders.paymentResult.payed_Date" : { $gte: new Date(new Date() - numberOfDays * 60 * 60 * 24 * 1000) }}, { 'orders.orderStatus': 'delivered' }, { 'amount': { $ne: 0 } }] } },
                 
                    { $project: { email: 1, 'orders.orderId': 1, 'orders.amount': 1, 'orders.orderItem': 1, 'orders.paymentResult': 1,'orders.paymentMethod': 1
                } },
 
                    {
                        $sort: { date: -1 }
                    }
                ]
            )
            console.log('reching')
            resolve(report)
        })
    },







}