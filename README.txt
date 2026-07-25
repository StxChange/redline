COMPLETE SAMPLE REDLINE APPRAISAL
=================================

This is the missing destination for the “Open the complete example” links.
It includes a portable static HTML version of the full sample appraisal and
all 18 collection images.

FILES TO UPLOAD
---------------
sample-appraisal.html
sample-appraisal.css
sample-appraisal.js
collection/                 Keep this folder and every image inside it

The react-next-source folder is included only as a reference copy of the
original ChatGPT Sites implementation. A regular HTML website does not need it.

INSTALL ON REDLINEPRICING.COM
-----------------------------
1. Upload the three sample-appraisal files and the collection folder into the
   same directory as the RedlinePricing.com homepage.

2. The public example should then open at:
   https://www.redlinepricing.com/sample-appraisal.html

3. In appraisal-config.js from the pricing-page download, set:

   sampleReportUrl: "sample-appraisal.html",

4. Keep appraisal-pricing.html in the same directory. The sample report’s
   “Get an appraisal” links already point to appraisal-pricing.html.

5. Test these functions after uploading:
   - Search by model, year or color
   - Confidence filter
   - Value/year sorting
   - Photo enlargement
   - eBay sold-comparable links
   - Print report

PRIVACY
-------
The example contains no collector name or contact information. It does display
the submitted collection photographs, the 15 appraisal groups and the working
market ranges.
