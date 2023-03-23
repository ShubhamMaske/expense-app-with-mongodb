exports.getExpenses = async (req,where) => {
    return req.user.getExpenses(where);
}