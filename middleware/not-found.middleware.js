const notFound = (req, res) => res.status(404).send({ msg: 'Route does not exist' });

export default notFound;
