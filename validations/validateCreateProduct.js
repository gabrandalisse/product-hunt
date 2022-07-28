/**
 * Check if the product to create have valid data
 * @param {*} values The information of the new product 
 * @returns {object} An object containing the information errors wording
 */
export default function validateCreateProduct(values) {
  let errors = {};

  if (!values.nombre) errors.nombre = "The name is required.";

  if (!values.empresa) errors.empresa = "The enterprise name is required.";

  if (!values.url) {
    errors.url = "The product URL is required.";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
    errors.url = "Invalid URL.";
  }

  if (!values.descripcion)
    errors.descripcion = "Product description is required.";

  return errors;
}
