# CPSC 5200 Group Project - Arcticats
Colin Aylward, Ulysses Lin, Sarah Pappas, Drew Messner

## Overview
This project is an implementation of a simple UI and more complete API for managing a flexible international address search system.  The front end and API layer are NodeJS while the data layer in the backend is based on MongoDB running on top of Azure Cosmos DB.  The combination of a scale out approach on all three layers of the application allows us to scale over time with the increasing adoption of this service.

## High Level Architecture

<img src="docs\HighLevel.svg">

- User Interaction with UX:  Request Response (54)
- User Interaction with API: Request Response (54)
- UX Interaction with API: Request Response (54)
- API: Resource API (38)
- UX and API: Node.JS
- Datastore: CosmosDB/NoSQL

## Data Structure

<img src="docs\DataStructure.svg">

Our approach to dealing with the variation of address structure across countries is to break the format out by country. This allows for the rules around format in a given country to be combined with a standardized address format across all countries.  The schemas for Address and Country are below:

### Address Schema
```
{
    streetNumber: { type: String },
    streetName: { type: String },
    municipalitySubDivision : { type: String },
    municipality: { type: String },
    countrySecondarySubdivision: { type: String },
    countryTertiarySubdivision:{ type: String },
    countrySubDivision: { type: String },
    postalCode: { type: String },
    extendedPostalCode: { type: String },
    countryCode: { type: String },
    country: { type: String },
    countrySubdivisionName: { type: String }
  }
```
### Country Schema
```
{
    country: { type: String, required: true, unique: true },
    format: [
        [{type: String}] //required true or false
    ],
    labels: {
        streetNumber: { type: String },
        streetName: { type: String },
        municipalitySubDivision : { type: String },
        municipality: { type: String },
        countrySecondarySubdivision: { type: String },
        countryTertiarySubdivision:{ type: String },
        countrySubDivision: { type: String },
        postalCode: { type: String },
        extendedPostalCode: { type: String },
        countryCode: { type: String },
        country: { type: String },
        countrySubdivisionName: { type: String }
    },
    values: {
        countrySubDivision: []
    },
    required: [{ type: String }],
  }
```
## User Flow

<img src="docs\UserFlow.svg">

Users of the User Interface start with the ability to search all countries or specifying a country and then searching.  If a country is selected the UI updates to reflect that countries address format.  Search results are limited to 50 addresses.

## API Specification

API's are Available on both the Address and Country resources under the API folder.

### Address APIs

| Call   | API                 | Input                      | Output                                    |
|--------|---------------------|----------------------------|-------------------------------------------|
| POST   | validateAddress     | Address Schema             | 200 or 500 with JSON of Failed Validation |
| GET    | getAddress          | Address Schema             | 200 with Address Schema                   |
| GET    | getAddressBatch     | Address Schema             | 200 with Array of Address Schemas         |
| POST   | addAddress          | Address Schema             | 200 with Address Schema                   |
| DELETE | deleteAddress       | Address Schema             | 200 with Address Schema                   |

### Country APIs

| Call   | API                 | Input                      | Output                                    |
|--------|---------------------|----------------------------|-------------------------------------------|
| GET    | countries           | Country Schema             | 200 with Distinct Sorted Array of Country |
| GET    | country             | Country Schema             | 200 with Country Schema                   |
| POST   | updateCountry       | Country Schema             | 200 with Country Schema                   |
| POST   | addCountry          | Country Schema             | 200 with Country Schema                   |
| DELETE | deleteCountry       | Country Schema             | 200 with Country Schema                   |
