const app = require('./app');

app.listen(process.env.PORT || 3340, () => {
    console.log('API is running on 3340');
});
