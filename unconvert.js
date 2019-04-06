{!REQUIRESCRIPT("/soap/ajax/26.0/connection.js")} 
{!REQUIRESCRIPT("/soap/ajax/26.0/apex.js")} 

var leadRecords = []; 

var contResult= sforce.connection.query("Select Id,lastname,firstname,LeadSource,MobilePhone,Description From contact Where accountid = '{!Account.Id}' "); 

var oppResult = sforce.connection.query("Select Id From Opportunity Where accountid = '{!Account.Id}' "); 


var idsForDeletion = []; 
var idsForLeadDelete = []; 

var newLead= new sforce.SObject("Lead"); 

var conRecords = contResult.getArray("records"); 
var oppRecords = oppResult.getArray("records"); 

for (var i=0; i<conRecords.length; i++) { 

newLead.LastName=conRecords[i].LastName; 
newLead.FirstName=conRecords[i].FirstName; 
newLead.Description=conRecords[i].Description; 
newLead.MobilePhone=conRecords[i].MobilePhone; 
idsForDeletion.push(conRecords[i].Id); 
} 
for (var i=0; i<oppRecords .length; i++) { 
idsForDeletion.push(oppRecords [i].Id); 
} 

newLead.Company = '{!Account.Name}'; 
newLead.NumberOfEmployees = '{!Account.NumberOfEmployees}'==''? 0 : '{!Account.NumberOfEmployees}'; 
newLead.Fax ='{!Account.Fax}'; 
newLead.Industry = '{!Account.Industry}'; 
newLead.Phone ='{!Account.Phone}'; 
newLead.Rating = '{!Account.Rating}'; 
newLead.Website = '{!Account.Website}'; 
newLead.Street ='{! Account.BillingStreet }'; 
newLead.City = '{! Account.BillingCity }'; 
newLead.Country= '{! Account.BillingCountry }'; 
newLead.PostalCode='{! Account.BillingPostalCode }'; 
newLead.State = '{! Account.BillingState }'; 
newLead.AnnualRevenue = '{!Account.AnnualRevenue}'==''? 0 : '{!Account.AnnualRevenue}'.replace("$", "").replace(",","").replace(",","").replace(",","").replace(",","").replace(",",""); 


idsForDeletion.push('{!Account.Id}'); 

if(conRecords.length!=0) 
{ 
var leadResult= sforce.apex.execute("UnconvertDelete","fetchLead",{accName: newLead.Company,lastName: newLead.LastName}); 


idsForLeadDelete.push(leadResult); 
sforce.connection.deleteIds(idsForLeadDelete); 


sforce.apex.execute("UnconvertDelete","deleteMethod",{deleteIds:idsForLeadDelete}); 

sforce.connection.deleteIds(idsForDeletion); 
sforce.apex.execute("UnconvertDelete","deleteMethod",{deleteIds:idsForDeletion}); 

leadRecords.push(newLead); 
result=sforce.connection.create(leadRecords); 

if(result[0].id!=null) 
{ 
window.location.href = '/' + result[0].id; 

} 
else 
{ 
alert('Due to some error Lead cannot be created'); 
window.location.reload(); 
} 
} 

else 
{ 
alert('Lead cannot be created as contact not present'); 
window.location.reload(); 
}