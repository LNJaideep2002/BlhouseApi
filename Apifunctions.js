
const CompanyOrdersapi = async (value) => {
    const response = await fetch('https://blhouse.herokuapp.com/companyOrder', {
        method: 'POST',
        body: JSON.stringify(value),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}
export { CompanyOrdersapi }

