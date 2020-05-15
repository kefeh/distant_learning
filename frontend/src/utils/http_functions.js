import axios from "axios";

// const baseUrl = "https://vita-1985599183.us-west-2.elb.amazonaws.com"
const baseUrl = "https://api.vitaresort.com";
//const baseUrl = "http://127.0.0.1:5000";

// AMENITIES
export function create_amenity(name, description, icon, favorite) {
    return axios.post(`${baseUrl}/api/amenities`, {
        name,
        description,
        icon,
        favorite,
    });
}

export function fetch_amenities() {
    return axios.get(`${baseUrl}/api/amenities`);
}

export function fetch_amenity(amenity_id) {
    return axios.get(`${baseUrl}/api/amenities/${amenity_id}`);
}

export function edit_amenity(amenity_id, name, description, icon, favorite) {
    return axios.put(`${baseUrl}/api/amenities/${amenity_id}`, {
        name,
        description,
        icon,
        favorite,
    });
}

export function delete_amenity(amenity_id) {
    return axios.delete(`${baseUrl}/api/amenities/${amenity_id}`);
}

// SERVICES
export function create_service(name, description, icon, price, favorite) {
    return axios.post(`${baseUrl}/api/services`, {
        name,
        description,
        icon,
        price,
        favorite,
    });
}

export function fetch_services() {
    return axios.get(`${baseUrl}/api/services`);
}

export function fetch_service(service_id) {
    return axios.get(`${baseUrl}/api/services/${service_id}`);
}

export function delete_service(service_id) {
    return axios.delete(`${baseUrl}/api/services/${service_id}`);
}

export function edit_service(service_id, name, description, icon, price, favorite) {
    return axios.put(`${baseUrl}/api/services/${service_id}`, {
        name,
        description,
        icon,
        price,
        favorite,
    });
}

// PROPERTIES
export function create_property(name, location, images, amenities, services) {
    return axios.post(`${baseUrl}/api/properties`, {
        name,
        location,
        images,
        amenities,
        services,
    });
}

export function fetch_properties() {
    return axios.get(`${baseUrl}/api/properties`);
}

export function fetch_property(property_id) {
    return axios.get(`${baseUrl}/api/properties/${property_id}`);
}

export function edit_property(property_id, name, location, images, amenities, services) {
    return axios.put(`${baseUrl}/api/properties/${property_id}`, {
        name,
        location,
        images,
        amenities,
        services,
    });
}

export function delete_property(property_id) {
    return axios.delete(`${baseUrl}/api/properties/${property_id}`);
}

// IMAGES
export function upload_image(image) {
    return axios.post(`${baseUrl}/api/image/upload`, image);
}

// APARTMENTS
export function create_apartment(amenities, description, name, images, price, max_guest, property_name, class_type, type, availability) {
    return axios.post(`${baseUrl}/api/apartment`, {
        amenities,
        description,
        name,
        images,
        price,
        max_guest,
        property_name,
        class: class_type,
        type,
        availability,
    });
}

export function fetch_apartments() {
    return axios.get(`${baseUrl}/api/apartment`);
}

export function edit_apartment(apartment_id, amenities, description, name, images, price, max_guest, property_name, class_type, type, availability) {
    return axios.put(`${baseUrl}/api/apartment/${apartment_id}`, {
        amenities,
        description,
        name,
        images,
        price,
        max_guest,
        property_name,
        class: class_type,
        type,
        availability,
    });
}

export function delete_apartment(apartment_id) {
    return axios.delete(`${baseUrl}/api/apartment/${apartment_id}`);
}

// APARTMENTTYPES
export function create_apartment_type(images, amenities, num_of_rooms, description) {
    return axios.post(`${baseUrl}/api/apartment_type`, {
        images,
        amenities,
        num_of_rooms,
        description,
    });
}

export function fetch_apartment_types() {
    return axios.get(`${baseUrl}/api/apartment_type`);
}

export function edit_apartment_type(apartment_type_id, amenities, description, images, num_of_rooms) {
    return axios.put(`${baseUrl}/api/apartment_type/${apartment_type_id}`, {
        amenities,
        description,
        images,
        num_of_rooms,
    });
}

export function delete_apartment_type(apartment_type_id) {
    return axios.delete(`${baseUrl}/api/apartment_type/${apartment_type_id}`);
}
