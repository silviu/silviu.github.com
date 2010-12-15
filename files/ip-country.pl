#!/usr/bin/perl
#-------------------------------------------------------------------------------
# CHANGE TOP LINE TO SUITE PATH TO PERL ON YOUR SERVER
#-------------------------------------------------------------------------------
###############################################################################
# WORKS ON LINUX SERVERS. NOT TESTED ON WINDOZE!!!
###############################################################################
# copyright 2005 by B Maurer.  All rights reserved.
# This program is free software; you can redistribute it and/or modify it
# under the same terms as Perl itself.
#
# INDEMNITY:
#
# THIS SOFTWARE IS PROVIDED WITHOUT ANY WARRANTY WHATSOEVER. USE ENTIRELY AT YOUR
# OWN RISK. NO LIABILITY WHATSOEVER, OF ANY NATURE, WILL BE ASSUMED BY
# THE AUTHORS. SHOULD THE SOFTWARE DAMAGE YOUR SERVER, CAUSE YOU LOSS OR OTHER
# FINANCIAL DAMAGE, YOU AGREE YOU HAVE NO CLAIM. IF YOU DO NOT ACCEPT THESE
# TERMS YOU MAY NOT USE THIS SOFTWARE.
###############################################################################
# WEBSITE: http://webnet77.com
# DOWNLOAD: http://webnet77.com/scripts/index.html
###############################################################################
use strict;
use CGI qw(:standard);
#-------------------------------------------------------------------------------
# Change the lines below to suite your application
#-------------------------------------------------------------------------------
my $geofile        = 'IpToCountry.csv';
my $date_delimiter = '-';
my $date_format    = 'mmm-dd-yyyy';
#-------------------------------------------------------------------------------
#             NO MORE USER DEFINABLE PARAMATERS AFTER THIS LINE
#-------------------------------------------------------------------------------
my ($form, $IP, $CC);
#-------------------------------------------------------------------------------
sub init(){
$form = qq|
<html>

<head>
<meta http-equiv="Content-Language" content="en-us" />
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252" />
<title>New Page 1</title>
</head>
<body>
<form method="POST">
	<p>Enter IP Address <input type="text" name="IP" size="20" value="$IP" />
	<input type="submit" value="Submit" name="submit" /></p>
</form>
<form method="POST">
	<p>Enter Country Code <input type="text" name="CC" size="2" value="$CC"><input type="submit" value="Submit" name="submit"></p>
</form>
</body>
</html>
|;
  print "Content-type: text/html\n\n";
  $IP = param('IP');
  $CC = param('CC');

}
#-------------------------------------------------------------------------------
sub comify($){

   my $text = reverse $_[0];
   $text =~ s/(\d\d\d)(?=\d)(?!\d*\.)/$1,/g;
   return scalar reverse $text;
}
#-------------------------------------------------------------------------------
sub epoch_to_dd_mm_yyyy($){

	my (undef, undef, undef, $dd, $mm, $yyyy, undef, undef, undef) = localtime(shift);
	my $r;
	my %m = (
	      '01'=>'Jan',
	      '02'=>'Feb',
	      '03'=>'Mar',
	      '04'=>'Apr',
	      '05'=>'May',
	      '06'=>'Jun',
	      '07'=>'Jul',
	      '08'=>'Aug',
	      '09'=>'Sep',
	      '10'=>'Oct',
	      '11'=>'Nov',
	      '12'=>'Dec',
	      );

	$yyyy += 1900;
	$mm++;

	$dd = sprintf('%02d', $dd);
	$mm = sprintf('%02d', $mm);

	my $mnth = $mm;

	if ($date_format eq 'dd-mmm-yyyy'){ $r = "$dd$date_delimiter$m{$mm}$date_delimiter$yyyy"; }
	if ($date_format eq 'mmm-dd-yyyy'){ $r = "$m{$mm}$date_delimiter$dd$date_delimiter$yyyy"; }
	if ($date_format eq 'yyyy-mmm-dd'){ $r = "$yyyy$date_delimiter$m{$mm}$date_delimiter$dd"; }
	if ($date_format eq 'yyyy-dd-mmm'){ $r = "$yyyy$date_delimiter$dd$date_delimiter$m{$mm}"; }

	if ($date_format eq 'dd-mm-yyyy'){ $r = "$dd$date_delimiter$mnth$date_delimiter$yyyy"; }
	if ($date_format eq 'mm-dd-yyyy'){ $r = "$mnth$date_delimiter$dd$date_delimiter$yyyy"; }
	if ($date_format eq 'yyyy-mm-dd'){ $r = "$yyyy$date_delimiter$mnth$date_delimiter$dd"; }
	if ($date_format eq 'yyyy-dd-mm'){ $r = "$yyyy$date_delimiter$dd$date_delimiter$mnth"; }

	return $r;
}
#------------------------------------------------------------------------------
sub number_to_ip($){ # Number => IP
my $ip = shift;
my (@octets,$i);

  $ip =~ /\n/g;
  for($i = 3; $i >= 0; $i--) {
    $octets[$i] = ($ip & 0xFF);
    $ip >>= 8;
  }
  return join('.', @octets);
}
#-------------------------------------------------------------------------------
sub ip_to_number($){ # IP => Number
my $ip = shift;
my (@octets, $ip_num);

    $ip =~ s/\n//g;
	@octets = split /\./, $ip;
	$ip_num = 0;
	foreach (@octets) {
	    $ip_num <<= 8;
	    $ip_num |= $_;
	}
return $ip_num;
}
#-------------------------------------------------------------------------------
sub ip_find($){
  my $ip = ip_to_number($_[0]);
  my ($start, $end, $found);
  my ($CC, $CTRY, $COUNTRY, $ALLOCATED, $REGISTRY, $NETBLOCK, $NUM_IP,
     $NUMERIC, $OCT, $HEX);

  $found = 0;
  open GF, "<$geofile";
  while (<GF>){
    next if ! /^"/;
    s/\n|"//g;
    ($start, $end, $REGISTRY, $ALLOCATED, $CC, $CTRY, $COUNTRY) = split /,/, $_;
    if (($ip >= $start) and ($ip <= $end)){
      $found = 1;
      $ALLOCATED = epoch_to_dd_mm_yyyy($ALLOCATED);
      $NETBLOCK = number_to_ip($start) . ' - ' . number_to_ip($end);
      $NUM_IP = comify($end - $start + 1);
      $NUMERIC = comify($start) . ' - ' . comify($end);
      $OCT = sprintf ('%o', $start) . ' - ' . sprintf ('%o', $end);
      $HEX = uc(sprintf ('%x', $start) . ' - ' . sprintf ('%x', $end));
      last;
    }
  }
  close GF;
  print "$IP not found\n" if ! $found;
  print qq|
	    <html>
	    <head>
	    </head>
	    <body>
	    <div align="center">
	        <table border="0" cellpadding="3" style="border-collapse: collapse">
	            <tbody>
	            <tr>
	                <td>IP Address</td>
	                <td>$IP</td>
	            </tr>
	            <tr>
	                <td>Country Code</td>
	                <td>$CC</td>
	            </tr>
	            <tr>
	                <td>Country </td>
	                <td>$CTRY</td>
	            </tr>
	            <tr>
	                <td>Country </td>
	                <td>$COUNTRY</td>
	            </tr>
	            <tr>
	                <td>Allocated</td>
	                <td>$ALLOCATED</td>
	            </tr>
	            <tr>
	                <td>Registry</td>
	                <td>$REGISTRY</td>
	            </tr>
	            <tr>
	                <td>Net block</td>
	                <td>$NETBLOCK</td>
	            </tr>
	            <tr>
	                <td>HEXADECIMAL</td>
	                <td>$HEX</td>
	            </tr>
	                <tr>
	                <td>OCTAL</td>
	                <td>$OCT</td>
	            </tr>
	            <tr>
	                <td>Numeric</td>
	                <td>$NUMERIC</td>
	            </tr>
	                <td>Hosts in block</td>
	                <td>$NUM_IP</td>
	            </tr>
	        </tbody>
	        </table>
	    </div>
	    </body></html>
  | if $found;
}
#-------------------------------------------------------------------------------
sub display_cc(){

  #my $ip = ip_to_number($CC);
  my ($start, $end, $found);
  my ($cc, $CTRY, $COUNTRY, $ALLOCATED, $REGISTRY, $NETBLOCK, $NUM_IP,
     $NUMERIC, $OCT, $HEX);


  open GF, "<$geofile";
  print "<html><head></head><body><pre>\n";
  print "<h1>[$CC]</h1>";
  while (<GF>){
    next if ! /^"/;
    s/\n|"//g;
    ($start, $end, $REGISTRY, $ALLOCATED, $cc, $CTRY, $COUNTRY) = split /,/, $_;
    if ($cc eq uc($CC)){
     print sprintf('%-13s', number_to_ip($start)) . " - " . sprintf('%-15s', number_to_ip($end)) . ' [' . comify($end - $start) . " IP's]\n";
    }
  }
  close GF;
  print "</pre></body>";
}
#-------------------------------------------------------------------------------
  init();
  if (! $IP){
    if (! $CC){
      print $form;
    }
    else {
      display_cc();
    }
  }

  else {
    if ($IP !~ /\b([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\b/){
      print "$IP is not valid\n";
      exit;
    }
    ip_find($IP);
  }
