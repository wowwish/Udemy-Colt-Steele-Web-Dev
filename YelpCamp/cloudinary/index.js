const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


/* 


In your own code, it is recommended to include v2 of the Node.js classes as follows:

var cloudinary = require('cloudinary').v2;

Alternatively, from within a module, you can use an ES6 import statement:

import { v2 as cloudinary } from 'cloudinary'

Following either of these, your upload and Admin API calls should omit the .v2 shown in the code examples of this guide.
For example, a simple image upload:

cloudinary.uploader.upload("my_image.jpg", function(error, result) {console.log(result, error)});




To use the Cloudinary Node.js library, you have to configure at least your 'cloud_name'. Your 'api_key' and 'api_secret' 
are also needed for secure API calls to Cloudinary (e.g., image and video uploads). You can find your account-specific 
configuration credentials in the Dashboard page of the account console.

In addition to the required configuration parameters, you can define a number of optional configuration parameters if 
relevant.  For backward compatibility reasons, the default value of the optional 'secure' configuration parameter is 
false. However, for most modern applications, it's recommended to configure the 'secure' parameter to true to ensure 
that your transformation URLs are always generated as HTTPS.

Setting the configuration parameters can be done globally, using either an environment variable or the config method, 
or programmatically in each call to a Cloudinary method. Parameters set in a call to a Cloudinary method override 
globally set parameters.

Setting the CLOUDINARY_URL environment variable:

You can configure the required 'cloud_name', 'api_key', and 'api_secret' by defining the 'CLOUDINARY_URL' environment variable. 
The 'CLOUDINARY_URL' value is available in the Dashboard page of the account console. When using Cloudinary through a 
PaaS add-on (e.g., Heroku or AppFog), this environment variable is automatically defined in your deployment 
environment. For example:

CLOUDINARY_URL=cloudinary://my_key:my_secret@my_cloud_name

Set additional parameters, for example upload_prefix and cname, to the environment variable:

CLOUDINARY_URL=cloudinary://my_key:my_secret@my_cloud_name?cname=mydomain.com&upload_prefix=myprefix.com

Setting configuration parameters globally:

Here's an example of setting configuration parameters globally in your Node application:

cloudinary.config({ 
  cloud_name: 'sample', 
  api_key: '874837483274837', 
  api_secret: 'a676b67565c6767a6767d6767f676fe1',
  secure: true
});




Configuration parameters

The first step in setting up any Cloudinary SDK is to set the global configuration parameters in the relevant 
configuration file (see the relevant SDK guide above for details on where and how to configure them for your SDK).

    -   The 'cloud_name' account identifier must be set for every SDK.
    -   Your account 'api_key' and 'api_secret' are mandatory settings for all backend SDKs.
        (The 'api_secret' should never be exposed in client-side code.)
    -   For all legacy SDKs, you'll probably want to set the 'secure' parameter to 'true' to ensure that your 
        transformation URLs are always generated as HTTPS. (In SDK major versions with initial release in 2020 or 
        later, this configuration parameter is 'true' by default.)
    -   There are also a number of additional optional configuration parameters you may want to define at a global level.

You can additionally set any of these configuration parameters in individual operations, which then overrides the 
globally set or default configuration values for that command.

The table below details all available Cloudinary SDK configuration parameters.
For details and examples of where and how to define these configuration parameters, see the relevant Cloudinary SDK 
framework guide.

Tip
In some SDK languages, you may need to adjust the case of the parameters shown below (for example to camelCase or 
kebab-case) to match the conventions of the language you are using.



Parameter 	Type 	Description


Cloud:		


cloud_name 	string 	Mandatory. The name of your Cloudinary account. Used to build the public URL for all your media assets.
api_key 	string 	Mandatory for server-side operations. Used together with the API secret to communicate with the Cloudinary API and sign requests.
api_secret 	string 	Mandatory for server-side operations. Used together with the API key to communicate with the Cloudinary API and sign requests.


URL: 		


secure 	Boolean 	Optional. Force HTTPS URLs for asset delivery even if they are embedded in non-secure HTTP pages.
    When using this option with a custom domain name (CNAME), specify your CNAME using the secure_distribution parameter 
    (and not the cname parameter).
    Default:
        false in legacy SDK versions
        true in SDK major versions with initial release in 2020 or later.
private_cdn 	Boolean 	Optional. Set this parameter to true if you are 
    an Advanced plan user with a private CDN distribution. Default: false.
    For details, see Private CDNs and CNAMEs.
secure_distribution 	string 	Optional. The custom domain name (CNAME) to use for building HTTPS URLs. 
    Use this option in conjunction with the secure=true option.
    Relevant only for Advanced plan users that have a private CDN distribution and a custom CNAME. For details, 
    see Private CDNs and CNAMEs.
cname 	string 	Optional. The custom domain name to use for building HTTP URLs. Use this option only if you do not 
    set secure=true. Relevant only for Advanced plan users that have a private CDN distribution and a custom CNAME. 
    For details, see Private CDNs and CNAMEs.
cdn_subdomain 	Boolean 	Optional. Whether to automatically build URLs with multiple CDN sub-domains. 
    In most cases, this is no longer necessary. Default: false. For details, see Multiple sub-domains.
upload_prefix(ApiBaseAddress in .NET) string 	Optional. Replaces the https://api.cloudinary.com part of the API 
    endpoint with the string specified. Relevant only for Enterprise plan users that are using an alternative data 
    center, for example https://api-eu.cloudinary.com.
analytics 	Boolean 	Optional. When true, URLs generated by the SDK include an appended query parameter that 
    passes SDK usage information. This data is used in aggregate form to help Cloudinary improve future SDK versions. 
    No individual data is collected and this data cannot be used to identify end users in any way.
    Note that if you have developed proprietary functionality that relies on asset delivery URL values 
    (CDN-based functionality, other query parameters, local storage of asset delivery URLs, etc), the appended query 
    param could impact that functionality.
    Default: true.
    Relevant only for new major SDK versions with initial release in 2020 or later.


Other:


upload_preset 	string 	Optional. The name of a defined upload preset. You can create upload presets in Upload 
    Settings in the console or using the upload_preset method of the Admin API. If you are planning to offer unsigned 
    uploads, you can define an unsigned upload preset to use with all uploads. This is especially useful for frontend 
    SDKs.
api_proxy 	string 	Optional. The URL of a proxy server in your environment for routing all Cloudinary Admin API and 
    Upload API method calls to Cloudinary.
signature_algorithm 	enum 	Optional. Sets the algorithm to use when the SDK generates a signature for API calls 
    or URL generation. Possible values: sha1 (default), sha256.


Provisioning: 		


provisioning_api_key 	string 	Mandatory for Provisioning API operations. Used together with the Provisioning API 
    secret to communicate with the Cloudinary API and authenticate provisioning requests.
provisioning_api_secret 	string 	Mandatory for Provisioning API operations. Used together with the Provisioning API 
    key to communicate with the Cloudinary API and authenticate provisioning requests.
account_id 	string 	Mandatory for Provisioning API operations. The ID of the Cloudinary account for provisioning.


Rails SDK only:	


static_image_support 	Boolean 	Relevant for Ruby on Rails SDK only. Optional. Whether to deliver uploaded static 
    images through Cloudinary. Default: false. For details, see Rails Static images.
enhance_image_tag 	Boolean 	Relevant for Ruby on Rails SDK only. Optional. Whether to wrap the standard 'image_tag' 
    view helper's method. Default: false.
    Set this parameter to true if 'static_image_support' is set to true.








Quick example: Transformations:

Take a look at the following transformation code and the image it delivers:


cloudinary.image("front_face.png", {secure: true, transformation: [
  {width: 150, height: 150, gravity: "face", crop: "thumb"},
  {radius: 20},
  {effect: "sepia"},
  {overlay: "cloudinary_icon_blue", gravity: "south_east", x: 5, y: 5, width: 50, opacity: 60, effect: "brightness:200"},
  {angle: 10}
  ]})


This relatively simple code performs all of the following on the original front_face.jpg image before delivering it:

    -   Crop to a 150x150 thumbnail using face-detection gravity to automatically determine the location for the crop
    -   Round the corners with a 20 pixel radius
    -   Apply a sepia effect
    -   Overlay the Cloudinary logo on the southeast corner of the image (with a slight offset). The logo is scaled down 
        to a 50 pixel width, with increased brightness and partial transparency (opacity = 60%)
    -   Rotate the resulting image (including the overlay) by 10 degrees
    -   Convert and deliver the image in PNG format (the originally uploaded image was a JPG)

And here's the URL that would be included in the image tag that's automatically generated from the above code:

https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_150,w_150/r_20/e_sepia/l_cloudinary_icon_blue,g_south_east,x_5,y_5,w_50,o_60,e_brightness:200/a_10/front_face.png

Quick example: File upload:

The following Node.js code uploads the 'dog.mp4' video to the specified account sub-folder using the public_id, 'my_dog'. 
The video will overwrite the existing 'my_dog' video if it exists. When the video upload is complete, the specified 
notification URL will receive details about the uploaded media asset.

cloudinary.v2.uploader.upload("dog.mp4", 
  {resource_type: "video", public_id: "myfolder/mysubfolder/my_dog",
  overwrite: true, notification_url: "https://mysite.example.com/notify_endpoint"},
  function(error, result) {console.log(result, error)});



*/



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary, // cloudinary: cloudinary
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}