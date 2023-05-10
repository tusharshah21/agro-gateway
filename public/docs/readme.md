# Masajja Division Urban Farming Initiative. (Ufarm)

The area Agricultural Officer has introduced a program to promote and support urban farming
practice while easing market access and improving on the family earnings and livelihoods. As a
refactored software developer, you are invited to implement an information system to support this
program.

## Under this Program

The division is divided into 4 urban wards (LCs), each Urban Ward has an appointed
FarmerOne (FO) who is the contact person for the Agricultural Officer (AO) for purposes of
mobilization, supervision, regulation and support. Fresh Horticulture produce, poultry and
dairy products are the only categories in this program.
The program is named Ufarm

## Program Procedures

### AO (Agricultural Officer)

• AO (Agricultural Officer) registers FO (FarmerOne) by (names, ward they represent,
unique FO number, date of registration, gender, date of birth, activities she/he involved,
NIN number, phone number, directions to her/his home, residence type, period of stay in
the ward in years- FO must have lived in the area for more than 10 years)
• AO access all registered FO and can only update activities she/he deals in, phone number.
• AO can appoint a new FO for a ward but not deleting any past FO records
• AO creates authentication details to FO.

### FO (FarmerOne)

• Registers the urban farmers in his/her area of administration by (name, gender, date of
registration, date of birth, activities undertaken, contacts, NIN, ward name, unique
id-will be used when uploading produce and products)
• Inspects the produce and agricultural activities for quality.
• Approves the farmers produce and products to be listed to the general public after
inspection
• See all bookings and orders

### Urban Farmers

• Can only use the system using the unique ids given by FO during registration
• Only registered Farmers upload produce and products they have by (name, ward name,
date, unit price in Ugx, quantity, mode of payment, directions, mode of delivery, produce
type)
• Once the produce is no longer available, it should be marked/Labeled with N/A
Produce type; organic, none organic.
Mode of payment; cash, mobile money
Mode of delivery; pick up, home delivery

### The General Public

• Views the listed produce and products details
• Book or order for the produce and products via mailing order or dial in after

#### Booking and Ordering

Critically implement mail-in order booking. (you can engage stakeholders; - ask farmers how it
should be done, or borrow concepts from learnt techniques)
Dial in involves picking up a phone call and call directly the produce farmer who has listed the
produce or products to the public

##### Rules

Should be implemented by use of Html5, Css/bootstrap, Js, Nodejs, Mondodb, you can also use Vue as well
All forms should be validated;
• Username should be alphanumeric and not empty
• All names should be strings between 5 to 50 characters
• NiN should be 13 alphanumeric characters
• Prices are in Ugx
• Younger than 10 years old should not be registered as farmerOne, urban farmers etc
• No form should be submitted when empty
• Make sure you use at least one fieldset in your solution
• Please consider validating obvious fields such as; phone numbers, date, characters only
fields etc.
Please Note:
This is an Individual project that is supposed to be implemented within a 6 weeks period of time
and be presented afterwards. The solution should exhibit the application of the concepts learnt
from the modules at Refactory
