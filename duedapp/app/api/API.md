# ../../node_modules/jsdoc-to-markdown/bin/cli.js API.js > API.md
<a name="module_API"></a>

## API

* [API](#module_API)
    * _static_
        * [.API](#module_API.API)
    * _inner_
        * [~postLogin
POST /auth/authorize(data, callback)](#module_API..postLogin
POST /auth/authorize) ⇒
        * [~postLogout
POST /auth/logout(data, callback)](#module_API..postLogout
POST /auth/logout) ⇒
        * [~postRegister
POST /auth/register(data, callback)](#module_API..postRegister
POST /auth/register) ⇒
        * [~getMemberships
POST /memberships/get
Returns list of membership plans (packages)(data, callback)](#module_API..getMemberships
POST /memberships/get
Returns list of membership plans (packages)) ⇒
        * [~membershipPurchase
POST /membership/purchase
Buy or renew subscription(data, callback)](#module_API..membershipPurchase
POST /membership/purchase
Buy or renew subscription) ⇒
        * [~postMembershipCancel
POST /membership/cancel(data, callback)](#module_API..postMembershipCancel
POST /membership/cancel) ⇒
        * [~getTerms
POST /terms/get(data, callback)](#module_API..getTerms
POST /terms/get) ⇒
        * [~postAuthReset
Reset user passwd
POST /auth/reset(data, callback)](#module_API..postAuthReset
Reset user passwd
POST /auth/reset) ⇒
        * [~postOfferFavorite
POST /offer/favorite(data, callback)](#module_API..postOfferFavorite
POST /offer/favorite) ⇒
        * [~deleteOfferFavorite
DELETE /offer/favorite(data, callback)](#module_API..deleteOfferFavorite
DELETE /offer/favorite) ⇒
        * [~postSurveyResult
POST /survey/results(data, callback)](#module_API..postSurveyResult
POST /survey/results) ⇒
        * [~postContactForm
POST /contact/form(data, callback)](#module_API..postContactForm
POST /contact/form) ⇒
        * [~getSurveys
POST /surveys/get(data, callback)](#module_API..getSurveys
POST /surveys/get) ⇒
        * [~getFaqs
POST /faqs/get(data, callback)](#module_API..getFaqs
POST /faqs/get) ⇒
        * [~getStyles
POST /styles/get(data, callback)](#module_API..getStyles
POST /styles/get) ⇒
        * [~postVoucherGetCode
POST /vouchers/getcode(data, callback)](#module_API..postVoucherGetCode
POST /vouchers/getcode) ⇒
        * [~getVouchers
POST /vouchers/get(data, callback)](#module_API..getVouchers
POST /vouchers/get) ⇒
        * [~postProfileDetails
POST /profile/details(data, callback)](#module_API..postProfileDetails
POST /profile/details) ⇒
        * [~postProfileUplink
POST /profile/uploadlink
After uploading use postProfileSetPhoto to set photo(data, callback)](#module_API..postProfileUplink
POST /profile/uploadlink
After uploading use postProfileSetPhoto to set photo) ⇒
        * [~postProfileSetPhoto
POST /profile/setphoto(data, callback)](#module_API..postProfileSetPhoto
POST /profile/setphoto) ⇒
        * [~postProfileSave
POST /profile/save(data, callback)](#module_API..postProfileSave
POST /profile/save) ⇒
        * [~getOffers
POST /offers/get(data, callback)](#module_API..getOffers
POST /offers/get) ⇒
        * [~postOfferApply
POST /offer/apply
Generates voucher for offer(data, callback)](#module_API..postOfferApply
POST /offer/apply
Generates voucher for offer) ⇒
        * [~getBookingsLink
POST /bookings/link(data, callback)](#module_API..getBookingsLink
POST /bookings/link) ⇒
        * [~postDevicesAdd
POST /devices/add
Add notification device id(data, callback)](#module_API..postDevicesAdd
POST /devices/add
Add notification device id) ⇒
        * [~postDevicesRemove
POST /devices/remove(data, callback)](#module_API..postDevicesRemove
POST /devices/remove) ⇒

<a name="module_API.API"></a>

### API.API
API

**Kind**: static constant of [<code>API</code>](#module_API)  
<a name="module_API..postLogin
POST /auth/authorize"></a>

### API~postLogin
POST /auth/authorize(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: string
       \{
            success: true,
             message: null,
             data: {
                <br>session_token: ‘Authorization token’,
                <br>name: ‘Name of user’,
                <br>email: ‘email of user’
            }
        \}  

| Param | Description |
| --- | --- |
| data | email, pass |
| callback |  |

<a name="module_API..postLogout
POST /auth/logout"></a>

### API~postLogout
POST /auth/logout(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: string
\{
 success: true
\}  

| Param | Description |
| --- | --- |
| data | empty |
| callback |  |

<a name="module_API..postRegister
POST /auth/register"></a>

### API~postRegister
POST /auth/register(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: string content of login return  

| Param | Description |
| --- | --- |
| data | name  email  passwd  passwd_repeat  postcode  number (phone)  agreed (1 or 0) |
| callback |  |

<a name="module_API..getMemberships
POST /memberships/get
Returns list of membership plans (packages)"></a>

### API~getMemberships
POST /memberships/get
Returns list of membership plans (packages)(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true,
       list: \[
             \{
                id: 'silver',
                'name': 'Silver',
                locked:true,
                cost: 2200, // cents
                costText: 'for £25/year',
                'image': 'https://...',
                offers: \[
                    {id:'xx',name:'xx',locked:true (offer format)},
                    ...

                    \]
            \},
            ...

       \],  

| Param | Description |
| --- | --- |
| data | page (0 to n)  id (optional id of item to return) |
| callback |  |

<a name="module_API..membershipPurchase
POST /membership/purchase
Buy or renew subscription"></a>

### API~membershipPurchase
POST /membership/purchase
Buy or renew subscription(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true  

| Param | Description |
| --- | --- |
| data | token : token from stripe payment  type: card type  expDate: card exp date  planId: membership id to buy |
| callback |  |

<a name="module_API..postMembershipCancel
POST /membership/cancel"></a>

### API~postMembershipCancel
POST /membership/cancel(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true  

| Param | Description |
| --- | --- |
| data | empty |
| callback |  |

<a name="module_API..getTerms
POST /terms/get"></a>

### API~getTerms
POST /terms/get(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true,
 message: null,
 terms: 'content of terms'  

| Param | Description |
| --- | --- |
| data | offerId (optional future)  voucherId (optional future)  (or empty) |
| callback |  |

<a name="module_API..postAuthReset
Reset user passwd
POST /auth/reset"></a>

### API~postAuthReset
Reset user passwd
POST /auth/reset(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true or success:false, message: 'error desc'  

| Param | Description |
| --- | --- |
| data | email_repeat  email |
| callback |  |

<a name="module_API..postOfferFavorite
POST /offer/favorite"></a>

### API~postOfferFavorite
POST /offer/favorite(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true  

| Param | Description |
| --- | --- |
| data | id |
| callback |  |

<a name="module_API..deleteOfferFavorite
DELETE /offer/favorite"></a>

### API~deleteOfferFavorite
DELETE /offer/favorite(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true  

| Param | Description |
| --- | --- |
| data | id |
| callback |  |

<a name="module_API..postSurveyResult
POST /survey/results"></a>

### API~postSurveyResult
POST /survey/results(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true  

| Param | Description |
| --- | --- |
| data | id: survey id  answers: json dict: \{"section no": \{ "question no": \{ "answer no": "answer value", ... \} \} \} |
| callback |  |

<a name="module_API..postContactForm
POST /contact/form"></a>

### API~postContactForm
POST /contact/form(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true  

| Param | Description |
| --- | --- |
| data | name  email  message |
| callback |  |

<a name="module_API..getSurveys
POST /surveys/get"></a>

### API~getSurveys
POST /surveys/get(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true,
 list: \[
         \{
             id: 'silver',
             'name': 'Survey A',
             done: false,
             'image': 'https://...',
             'description': 'Lorem ipsum',
             sections: \[
                 {
                     id: 'first',
                     name: 'Section',
                     description:' Sesc desc',
                     'questions': \[
                         \{
                             id: 'question',
                             name: 'Question',
                             type: 'radio',
                             answers: ['Answer A','Answer B','Answer C','Answer D'],
                             correctAnswers: [0,3]
                         \}

                         \]

                 \}


                 \]
         \},
         ...
         \]  

| Param | Description |
| --- | --- |
| data | page  id (opt) |
| callback |  |

<a name="module_API..getFaqs
POST /faqs/get"></a>

### API~getFaqs
POST /faqs/get(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true,
list: \[
         \{
             id: 'silver',
             'title': 'Test Faq',
             'content': 'Test content'
         \},
         ...
     \]  

| Param | Description |
| --- | --- |
| data | empty |
| callback |  |

<a name="module_API..getStyles
POST /styles/get"></a>

### API~getStyles
POST /styles/get(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true,
 list: \[
     \{
         id: 'silver',
         'title': 'Style',
         'content': 'Test content'
     \},
     ...
     \]  

| Param | Description |
| --- | --- |
| data | empty |
| callback |  |

<a name="module_API..postVoucherGetCode
POST /vouchers/getcode"></a>

### API~postVoucherGetCode
POST /vouchers/getcode(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true, code: 'xxxxx', message: 'your code is xxxxx. it was copied to the clipboard'  

| Param | Description |
| --- | --- |
| data | id : voucher id |
| callback |  |

<a name="module_API..getVouchers
POST /vouchers/get"></a>

### API~getVouchers
POST /vouchers/get(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true,
 list: \[
     \{
         id: 'silver',
         'name': 'Voucher A',
         locked: data.id?false:true,
         favorite: false,
         used: false,
         cost: 2200, // cents
         costText: '£24,00',
         'image': 'https://...',
         'description': 'Lorem ipsum'
    \},
        ...
     \]  

| Param | Description |
| --- | --- |
| data | page  id (opt) |
| callback |  |

<a name="module_API..postProfileDetails
POST /profile/details"></a>

### API~postProfileDetails
POST /profile/details(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true
name:'Test',
membership:\{name:'Silver',cost:2222,costText:'p 22',expDate:'11/2021'\},
avatarUrl: link or null  

| Param | Description |
| --- | --- |
| data | empty |
| callback |  |

<a name="module_API..postProfileUplink
POST /profile/uploadlink
After uploading use postProfileSetPhoto to set photo"></a>

### API~postProfileUplink
POST /profile/uploadlink
After uploading use postProfileSetPhoto to set photo(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true,
 upload_url: 'url to upload image to in cloud'  

| Param | Description |
| --- | --- |
| data | type mime type |
| callback |  |

<a name="module_API..postProfileSetPhoto
POST /profile/setphoto"></a>

### API~postProfileSetPhoto
POST /profile/setphoto(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true  

| Param | Description |
| --- | --- |
| data | photo_url: upload_url from postProfileUplink |
| callback |  |

<a name="module_API..postProfileSave
POST /profile/save"></a>

### API~postProfileSave
POST /profile/save(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true  

| Param | Description |
| --- | --- |
| data | name,email,passwd,passwd_repeat,postcode,number (phone) |
| callback |  |

<a name="module_API..getOffers
POST /offers/get"></a>

### API~getOffers
POST /offers/get(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true,
 list:\[
     \{
         id: 'silver',
         'name': 'Silver',
         locked: data.id?false:true,
         favorite: false,
         used: false,
         cost: 2200, // cents
         costText: 'for p25/year',
         'image': 'https://...',
         'description': 'Lorem ipsum'
    \},
     ...
     \]  

| Param | Description |
| --- | --- |
| data | page  id (opt) |
| callback |  |

<a name="module_API..postOfferApply
POST /offer/apply
Generates voucher for offer"></a>

### API~postOfferApply
POST /offer/apply
Generates voucher for offer(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true  

| Param | Description |
| --- | --- |
| data | id offer id |
| callback |  |

<a name="module_API..getBookingsLink
POST /bookings/link"></a>

### API~getBookingsLink
POST /bookings/link(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true,
 link: url to booking  

| Param | Description |
| --- | --- |
| data | empty |
| callback |  |

<a name="module_API..postDevicesAdd
POST /devices/add
Add notification device id"></a>

### API~postDevicesAdd
POST /devices/add
Add notification device id(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true  

| Param | Description |
| --- | --- |
| data | access_token UDID  platform \[ios|android\] |
| callback |  |

<a name="module_API..postDevicesRemove
POST /devices/remove"></a>

### API~postDevicesRemove
POST /devices/remove(data, callback) ⇒
**Kind**: inner method of [<code>API</code>](#module_API)  
**Returns**: success: true  

| Param | Description |
| --- | --- |
| data | access_token UDID  platform \[ios|android\] |
| callback |  |

