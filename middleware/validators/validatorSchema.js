import Joi from 'joi';

const categoryTypes = ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta','Noodles']

const foodSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            'any.required': 'Name is required',
            'string.empty': 'Name cannot be empty'
        }),
    description: Joi.string()
        .required(),
    price: Joi.number()
        .required()
        .min(0),
    image:Joi.string()
        .required(),
    category: Joi.string()
        .required()
        .valid(...categoryTypes)
        .messages({
            'any.required': 'Category is required',
            'any.only': 'Category must be one of Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta,Noodles'
        })
});

export {foodSchema}
