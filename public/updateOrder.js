function updateOrder(order_id){
    console.log(order_id)
    $.ajax({
        url: '/order/' + order_id,
        type: 'PUT',
        data: $('#update-Order').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
