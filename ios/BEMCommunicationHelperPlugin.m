#import "BEMCommunicationHelperPlugin.h"
#import "BEMCommunicationHelper.h"

@implementation BEMCommunicationHelperPlugin

- (void)pushGetJSON:(CDVInvokedUrlCommand *)command
{
    NSString* callbackId = [command callbackId];
    
    @try {
        NSString* relativeURL = [[command arguments] objectAtIndex:0];
        NSDictionary* filledMessage = [[command arguments] objectAtIndex:1];

        [CommunicationHelper pushGetJSON:filledMessage toURL:relativeURL completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            if (error != NULL) {
                NSLog(@"Got error for command with URL %@", [[command arguments] objectAtIndex:0]);
                [self sendError:[error localizedDescription] callBackID:callbackId];
            } else {
            NSError *parseError;
            NSDictionary *parsedResult = [NSJSONSerialization JSONObjectWithData:data
                                                                options:kNilOptions
                                                                  error: &parseError];
            if (parseError != NULL) {
                [self sendError:parseError callBackID:callbackId];
            }
            CDVPluginResult* result = [CDVPluginResult
                                       resultWithStatus:CDVCommandStatus_OK
                                       messageAsDictionary:parsedResult];
            [self.commandDelegate sendPluginResult:result callbackId:callbackId];
            }
        }];
    }
    @catch (NSException *exception) {
        [self sendError:exception callBackID:callbackId];
    }
}

- (void) sendError:(id) error callBackID:(NSString*)callbackID {
    NSString* msg = [NSString stringWithFormat: @"During server call, error %@", error];
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_ERROR
                               messageAsString:msg];
    [self.commandDelegate sendPluginResult:result callbackId:callbackID];
}

@end
