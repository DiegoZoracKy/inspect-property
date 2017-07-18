'use strict';

const _inspectFunction = require('inspect-function');
const forEachProperty = require('for-each-property');
const forEachPropertyDeep = require('for-each-property-deep');

function inspectProperty(o, propertyName, { delimiter = '.', inspectFunction = true, inspectProperties = true, enumerability, inherited } = {}) {
	const property = o && propertyName ? o[propertyName] : o;

	const isClassRegExp = /^\s*class\s+/;
	const propertyInspection = {
		value: property,
		type: typeof(property),
		isClass: isClassRegExp.test(o.toString()),
		constructor: {
			name: property && property.constructor && property.constructor.name,
			ref: property && property.constructor
		}
	};

	if (o && propertyName) {
		propertyInspection.propertyDescriptor = Object.getOwnPropertyDescriptor(o, propertyName);
	}

	if (propertyInspection.type === 'function' && !propertyInspection.isClass && inspectFunction) {
		propertyInspection.functionInspection = _inspectFunction(property);
	}

	if (propertyInspection.type === 'function' || propertyInspection.type === 'object') {
		propertyInspection.properties = forEachPropertyDeep(property, (value, key, path, parent, state) => {
			state[path.join(delimiter)] = value;
		}, { enumerability, inherited });

		forEachProperty(propertyInspection.properties, (value, key) => {
			propertyInspection.properties[key] = value === undefined || value === null || !inspectProperties ? value : inspectProperty(value, null, { inspectFunction, inspectProperties: false });
		});
	}

	return propertyInspection;
}

module.exports = inspectProperty;